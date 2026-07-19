import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { motion } from "motion/react";
import { createPortal } from "react-dom";
import { useI18n } from "../contexts/i18n";
import * as Icons from "./Icons";
import PageLayout from "./PageLayout";
import CardTitle from "./CardTitle";
import Lightbox from "./Lightbox";
import OptimizedImage from "./OptimizedImage";

interface Achievement {
  label: string;
  value: number;
}

interface Job {
  id?: number;
  key: string;
  company: string;
  logoUrl: string;
  logos?: string[];
  date: string;
  period?: string;
  color: string;
  title: string;
  teamSize: string;
  responsibilities: string[];
  tasks?: string[];
  projects?: string[];
  achievements: Achievement[];
  images?: string[];
}

interface JobAchievementCardProps {
  achievement: Achievement;
  color: string;
  isForPrint?: boolean;
}

interface WorkExperiencePageProps {
  id?: string;
  onNavigate?: (key: string) => void;
  isForPrint?: boolean;
}

const JobAchievementCard: React.FC<JobAchievementCardProps> = ({
  achievement,
  color,
  isForPrint = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isForPrint) return; // Skip observer for print

    const element = cardRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [isForPrint]);

  return (
    <div
      ref={cardRef}
      className={`job-achievement-card fade-in-up-on-scroll ${isForPrint ? "is-visible" : ""}`}
      style={{ "--achievement-color": color } as React.CSSProperties}
    >
      <div
        className="job-achievement-card-header"
        style={{
          padding: "0 0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "4px",
          minHeight: "80px",
        }}
      >
        <span
          className="job-achievement-card-value"
          style={{ fontSize: "48px", fontWeight: 700, color: "var(--achievement-color)", lineHeight: "1" }}
        >
          {achievement.value}%
        </span>
        <span
          className="job-achievement-card-label"
          style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-brand-text-secondary)", lineHeight: "1.2" }}
        >
          {achievement.label}
        </span>
      </div>
      <div
        className="progress-bar-container"
        style={{
          height: "12px",
          marginBottom: "0",
          padding: "0 0.5rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="progress-bar-bg"
          style={{ height: "3px", width: "100%" }}
        >
          <div
            className="progress-bar-fill"
            style={
              {
                "--level": `${achievement.value}%`,
                backgroundColor: color,
                height: "3px",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </div>
  );
};
const WorkExperiencePage: React.FC<WorkExperiencePageProps> = ({
  id,
  onNavigate,
  isForPrint = false,
}) => {
  const { t } = useI18n();
  const pageData = t.workExperiencePage || { jobs: [] };
  const jobs: Job[] = useMemo(
    () => [...(pageData.jobs || [])],
    [pageData.jobs],
  );

  const resolveSolidColor = (colorStr: string): string => {
    if (colorStr === "gradient-2026") {
      return "#8A2387";
    }
    return colorStr;
  };

  const getCompanyColorStyle = (colorStr: string): React.CSSProperties => {
    if (colorStr === "gradient-2026") {
      return {
        backgroundImage: "linear-gradient(135deg, #0054A6 0%, #F15A24 20%, #009E49 40%, #D81B60 60%, #ED1C24 80%, #A50064 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent"
      };
    }
    return { color: colorStr };
  };

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 767 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Always start from 0 as requested, unless we have a referrer
  const [activeJobIndex, setActiveJobIndex] = useState(() => {
    const savedIndex = sessionStorage.getItem("referrer_job_index");
    if (savedIndex) {
      const parsed = parseInt(savedIndex, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < jobs.length) {
        return parsed;
      }
    }
    return 0;
  });
  const [jobVideoState, setJobVideoState] = useState<'video1' | 'video2'>('video1');
  const [jobVideoMuted, setJobVideoMuted] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(() => {
    const savedIndex = sessionStorage.getItem("referrer_job_index");
    return savedIndex ? false : true;
  });

  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [milestoneCenters, setMilestoneCenters] = useState<number[]>([]);

  // Function to play a gentle click sound
  const playClickSound = () => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioCtx.currentTime + 0.1,
      );

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + 0.1,
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // Silently fail if audio context is blocked
    }
  };

  // Auto-play interval logic
  useEffect(() => {
    if (!isAutoPlaying || isForPrint || jobs.length === 0 || isMobile) return;

    const interval = setInterval(() => {
      setActiveJobIndex((prev) => {
        const next = prev + 1;
        if (next >= jobs.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        playClickSound(); // Play sound on auto-switch
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, jobs.length, isForPrint, isMobile]);

  // Reset when becoming visible (for mobile scroll-based navigation)
  useEffect(() => {
    if (isForPrint) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const isReferrer =
            sessionStorage.getItem("referrer_experience") === "true";
          if (isReferrer) {
            // Clear referrers so subsequent scrolls behave normally
            sessionStorage.removeItem("referrer_experience");
            sessionStorage.removeItem("referrer_job_index");
          } else {
            setActiveJobIndex(0);
            if (!isMobile) {
              setIsAutoPlaying(true);
            }
          }
        }
      },
      { threshold: 0.2 }, // Trigger when 20% of the section is visible
    );

    const currentRef = document.getElementById(id || "");
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => observer.disconnect();
  }, [id, isForPrint]);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);

  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const videoUrl =
    "https://cdn.scena.ai/project/9626/73ac4eba329685bd72456c50028cd25e546ffb80b1481dd3046732329d981b9b.mp4";

  useEffect(() => {
    milestoneRefs.current = milestoneRefs.current.slice(0, jobs.length);
  }, [jobs]);

  const calculateLines = useCallback(() => {
    const container = timelineContainerRef.current;
    if (!container || milestoneRefs.current.length === 0 || isForPrint) return;

    requestAnimationFrame(() => {
      const milestones = milestoneRefs.current.filter(
        Boolean,
      ) as HTMLDivElement[];
      if (milestones.length === 0) return;

      const firstMilestone = milestones[0];
      const lastMilestone = milestones[milestones.length - 1];
      const activeMilestone = milestones[activeJobIndex] || firstMilestone;

      // Use offsetLeft/OffsetWidth for more reliable relative positioning
      const firstCenter =
        firstMilestone.offsetLeft + firstMilestone.offsetWidth / 2;
      const lastCenter =
        lastMilestone.offsetLeft + lastMilestone.offsetWidth / 2;
      const activeCenter =
        activeMilestone.offsetLeft + activeMilestone.offsetWidth / 2;

      const segmentsLeft = firstCenter;
      const segmentsWidth = lastCenter - firstCenter;

      const progressLeft = firstCenter;
      const progressWidth = activeCenter - firstCenter;

      const centers = milestones.map((m) => m.offsetLeft + m.offsetWidth / 2);
      setMilestoneCenters(centers);

      container.style.setProperty("--segments-left", `${segmentsLeft}px`);
      container.style.setProperty("--segments-width", `${segmentsWidth}px`);
      container.style.setProperty("--progress-left", `${progressLeft}px`);
      container.style.setProperty("--progress-width", `${progressWidth}px`);
      container.style.setProperty(
        "--progress-bg-color",
        resolveSolidColor(jobs[activeJobIndex]?.color || "var(--accent-color)"),
      );
      container.style.setProperty("--timeline-opacity", "1");
    });
  }, [activeJobIndex, isForPrint, jobs]);

  useLayoutEffect(() => {
    if (isForPrint) return;

    const container = timelineContainerRef.current;
    if (!container) return;

    // Use ResizeObserver for more robust tracking of layout changes
    const observer = new ResizeObserver(() => {
      calculateLines();
    });

    observer.observe(container);
    milestoneRefs.current.forEach((m) => {
      if (m) observer.observe(m);
    });

    // Initial calculation
    calculateLines();

    return () => {
      observer.disconnect();
    };
  }, [isForPrint, calculateLines]);

  const formatJobDate = (dateString: string) => {
    return dateString.replace(
      /(\d{4})\s*-\s*(\d{4})/,
      "Từ Năm $1 đến Năm $2",
    );
  };

  if (isForPrint) {
    return (
      <div className="print-page">
        <div className="info-card no-padding is-for-print">
          <CardTitle
            icon={<Icons.BriefcaseIcon />}
            text={pageData.title}
            tooltipTitle={pageData.tooltipTitle}
            tooltipText={pageData.tooltipText}
            style={{ marginBottom: "1.5rem" }}
          />
          <div className="experience-layout no-scrollbar">
            {jobs.map((job) => (
              <div key={job.key} className="print-job-item">
                <div className="job-header">
                  <div className="job-header-info">
                    <span className="job-date">{formatJobDate(job.date)}</span>
                    <h3>{job.title}</h3>
                    {(() => {
                      const companyStr = job.company;
                      const hasParensVi = companyStr.includes(" (");
                      const hasParensEn = companyStr.includes(" - (");
                      if (hasParensVi) {
                        const idx = companyStr.indexOf(" (");
                        return (
                          <>
                            <h4 style={{ margin: 0 }}>{companyStr.substring(0, idx)}</h4>
                            <div style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "2px" }}>
                              {companyStr.substring(idx).trim()}
                            </div>
                          </>
                        );
                      } else if (hasParensEn) {
                        const idx = companyStr.indexOf(" - (");
                        return (
                          <>
                            <h4 style={{ margin: 0 }}>{companyStr.substring(0, idx)}</h4>
                            <div style={{ fontSize: "0.85em", opacity: 0.8, marginTop: "2px" }}>
                              {`(${companyStr.substring(idx + 3).trim()}`}
                            </div>
                          </>
                        );
                      }
                      return <h4 style={{ margin: 0 }}>{job.company}</h4>;
                    })()}
                  </div>
                </div>
                <h5>{pageData.descriptionTitle}</h5>
                <ul>
                  {job.responsibilities.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Icons.CheckIcon
                        size={16}
                        className="text-blue-500 mt-1 shrink-0"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </ul>
                {job.achievements.length > 0 && (
                  <>
                    <h5>{pageData.achievementsTitle}</h5>
                    <div className="job-achievements-grid">
                      {job.achievements.map((ach, index) => (
                        <JobAchievementCard
                          key={index}
                          achievement={ach}
                          color={job.color}
                          isForPrint={true}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getAchievementIcon = (label: string) => {
    const l = label.toLowerCase();

    // Process/Standardization -> ClipboardDocumentListIcon
    if (
      l.includes("chuẩn hóa") ||
      l.includes("process") ||
      l.includes("standard")
    ) {
      return <Icons.ClipboardDocumentListIcon size={12} />;
    }
    // Task/Completion -> CheckIcon
    if (
      l.includes("nhiệm vụ") ||
      l.includes("task") ||
      l.includes("hoàn thành")
    ) {
      return <Icons.CheckIcon size={12} />;
    }
    // Guidance/New employees -> UsersIcon
    if (
      l.includes("nhân viên mới") ||
      l.includes("employee guidance") ||
      l.includes("hướng dẫn")
    ) {
      return <Icons.UsersIcon size={12} />;
    }
    // Document Compilation/Biên soạn tài liệu -> DocumentTextIcon
    if (
      l.includes("tài liệu") ||
      l.includes("document") ||
      l.includes("biên soạn")
    ) {
      return <Icons.DocumentTextIcon size={12} />;
    }
    // Events -> SparklesIcon
    if (l.includes("sự kiện") || l.includes("event")) {
      return <Icons.SparklesIcon size={12} />;
    }
    // Community -> UsersIcon
    if (l.includes("cộng đồng") || l.includes("community")) {
      return <Icons.UsersIcon size={12} />;
    }
    // Response/Support/Call Center -> PhoneIcon or ChatBubbleLeftRightIcon
    if (
      l.includes("phản hồi") ||
      l.includes("response") ||
      l.includes("call center") ||
      l.includes("hỗ trợ")
    ) {
      return <Icons.PhoneIcon size={12} />;
    }
    // E-commerce/TMĐT -> GlobeAltIcon
    if (l.includes("tmđt") || l.includes("e-commerce")) {
      return <Icons.GlobeAltIcon size={12} />;
    }
    // Project -> FolderIcon
    if (l.includes("dự án") || l.includes("project")) {
      return <Icons.FolderIcon size={12} />;
    }
    // Insurance/Online management -> ShieldCheckIcon
    if (
      l.includes("bảo hiểm") ||
      l.includes("insurance") ||
      l.includes("ra mắt")
    ) {
      return <Icons.ShieldCheckIcon size={12} />;
    }

    // Default fallback
    return <Icons.TrophyIcon size={12} />;
  };

  const activeJob = jobs[activeJobIndex] || jobs[0];
  const [isExpanded, setIsExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);

  useEffect(() => {
    if (showCompanyPopup || showVideoPopup || lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCompanyPopup, showVideoPopup, lightboxIndex]);
  const [selectedJobForPopup, setSelectedJobForPopup] = useState<Job | null>(
    null,
  );

  const lightboxImages = useMemo(() => {
    if (!activeJob?.images) return [];
    return activeJob.images.map((img) => ({
      src: img,
      alt: activeJob.company,
    }));
  }, [activeJob]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNextLightbox = () => {
    if (lightboxImages.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null ? 0 : (prev + 1) % lightboxImages.length,
    );
  };

  const handlePrevLightbox = () => {
    if (lightboxImages.length === 0) return;
    setLightboxIndex((prev) =>
      prev === null
        ? 0
        : (prev - 1 + lightboxImages.length) % lightboxImages.length,
    );
  };

  const handleMilestoneClick = (index: number) => {
    setIsAutoPlaying(false);
    setActiveJobIndex(index);
    setIsExpanded(false);
    playClickSound(); // Play sound on manual click
    if (isMobile) {
      setSelectedJobForPopup(jobs[index]);
      setShowCompanyPopup(true);
    }
  };
  return (
    <PageLayout 
        id={id} 
        className="work-experience-section"
        innerStyle={{ borderRadius: "16px" }}
    >
      <div
        className="info-card no-padding work-experience-card flex flex-col h-full"
        style={{ 
            position: "relative"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <CardTitle
            icon={<Icons.BriefcaseIcon />}
            text={pageData.title}
            tooltipTitle={pageData.tooltipTitle}
            tooltipText={pageData.tooltipText}
            containerStyle={{ height: "50px" }}
          />

        </div>

        <div className="work-experience-info">
          <div
            className={`timeline-navigation-wrapper no-scrollbar ${isMobile ? "vertical" : ""}`}
            style={{ 
              height: isMobile ? "100%" : "130px", 
              maxHeight: isMobile ? "100%" : undefined, 
              overflowY: isMobile ? "hidden" : undefined,
              flex: isMobile ? 1 : undefined,
              paddingLeft: "0px",
              paddingTop: "0px",
              marginTop: "0px",
              marginBottom: "2px",
              paddingBottom: "0px",
              paddingRight: "0px"
            }}
          >
            <div
              className={`timeline-container ${isMobile ? "vertical" : ""}`}
              ref={timelineContainerRef}
              style={{ height: isMobile ? "auto" : "130px" }}
            >
              <div id="timeline-segments-container" style={{ display: "none" }}></div>
              <div id="timeline-progress-bar" style={{ display: "none" }}></div>
              {!isMobile && milestoneCenters.length === jobs.length && 
                jobs.slice(0, -1).map((_, i) => {
                  const leftCenter = milestoneCenters[i];
                  const rightCenter = milestoneCenters[i + 1];
                  const logoRadius = 28; // 3.5rem = 56px, radius is 28px
                  const gap = 12; // Gap between circle edge and line segment
                  const startX = leftCenter + logoRadius + gap;
                  const endX = rightCenter - logoRadius - gap;
                  const width = Math.max(0, endX - startX);
                  
                  // Active state: if current segment is to the left of the active milestone
                  // i.e., i < activeJobIndex
                  const isActive = i < activeJobIndex;
                  const segmentColor = isActive 
                    ? resolveSolidColor(jobs[activeJobIndex]?.color || "var(--accent-color)")
                    : "var(--color-brand-progress-bg)";
                  
                  return (
                    <div
                      key={`segment-${i}`}
                      className="timeline-segment-line"
                      style={{
                        position: "absolute",
                        left: `${startX}px`,
                        width: `${width}px`,
                        top: "calc(50% + 19.5px)", // Align with original line center
                        height: "2px",
                        backgroundColor: segmentColor,
                        transform: "translateY(-50%)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        zIndex: 1,
                      }}
                    >
                      {/* Left Dot */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: "50%",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: segmentColor,
                          transform: "translate(-50%, -50%)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                      {/* Right Dot */}
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "50%",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: segmentColor,
                          transform: "translate(50%, -50%)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </div>
                  );
                })
              }
              {jobs.map((job, index) => (
                <div
                  key={job.key}
                  ref={(el) => {
                    if (el) milestoneRefs.current[index] = el;
                  }}
                  className={`timeline-milestone ${index === activeJobIndex ? "active" : ""}`}
                  onClick={() => handleMilestoneClick(index)}
                  style={{ "--item-color": resolveSolidColor(job.color) } as React.CSSProperties}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setActiveJobIndex(index);
                  }}
                  aria-label={`View details for ${job.company}`}
                >
                  <div
                    className="year-text"
                    style={
                      index === activeJobIndex 
                        ? (job.color === "gradient-2026" 
                          ? {} 
                          : { color: job.color })
                        : undefined
                    }
                  >
                    <Icons.CalendarDaysIcon size={16} style={{ color: index === activeJobIndex ? resolveSolidColor(job.color) : undefined }} />
                    <span style={index === activeJobIndex ? getCompanyColorStyle(job.color) : undefined}>
                      {job.date.split(" - ")[0]}
                    </span>
                  </div>
                  <div className="timeline-dot-container">
                    <motion.div
                      className="timeline-dot"
                      style={{
                        borderColor: resolveSolidColor(job.color),
                      }}
                      animate={
                        index === activeJobIndex
                          ? {
                              y: [0, -6, 0],
                            }
                          : { y: 0 }
                      }
                      transition={
                        index === activeJobIndex
                          ? {
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }
                          : {}
                      }
                    >
                      {job.key === 'jobsearch' ? (
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #0054A6 0%, #F15A24 20%, #009E49 40%, #D81B60 60%, #ED1C24 80%, #A50064 100%)',
                          borderRadius: '50%',
                          color: 'white',
                          fontWeight: '900',
                          fontSize: '14px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          border: '2px solid rgba(255,255,255,0.8)',
                          boxShadow: '0 0 15px rgba(var(--accent-color-rgb), 0.5)'
                        }}>
                          2026
                        </div>
                      ) : job.logoUrl ? (
                        <img
                          src={job.logoUrl}
                          alt={`${job.company} logo`}
                          className="timeline-dot-img"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {activeJob && !isMobile && (
            <div
              className={`job-card experience-item flex flex-col justify-between ${isExpanded ? "is-expanded" : ""}`}
              key={activeJob.key}
              style={{
                border: activeJob.key === 'jobsearch' ? 'none' : `2px solid ${resolveSolidColor(activeJob.color)}`,
                borderRadius: isExpanded ? "16px" : "24px",
                padding: activeJob.key === 'jobsearch' ? '0px' : "1.75rem",
                width: isExpanded ? "100%" : "calc(100% - 51px)",
                flex: 1,
                minHeight: 0,
                marginLeft: isExpanded ? "0px" : "25.5px",
                marginRight: isExpanded ? "0px" : "25.5px",
                marginTop: isExpanded ? "0px" : "10px",
                marginBottom: "0px",
                boxShadow: isExpanded
                  ? `0 24px 60px -12px rgba(0, 0, 0, 0.55), 0 0 25px -3px ${resolveSolidColor(activeJob.color)}44`
                  : `0 12px 40px -8px rgba(0, 0, 0, 0.4), 0 0 15px -3px ${resolveSolidColor(activeJob.color)}33`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: isExpanded ? 50 : 1,
                position: isExpanded ? "absolute" : "relative",
                top: isExpanded ? 0 : undefined,
                left: isExpanded ? 0 : undefined,
                right: isExpanded ? 0 : undefined,
                bottom: isExpanded ? 0 : undefined,
                cursor: "default",
                overflow: "hidden",
                color: "#000000",
              }}
            >
              {activeJob.key === "jobsearch" ? (
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: isExpanded ? "16px" : "24px" }}>
                  <video
                    key={jobVideoState}
                    src={
                      jobVideoState === "video1"
                        ? "https://cdn.scena.ai/project/9626/d97de7f6bb813019350838499ee0f3b11f711487c7d9961679f3a43d8a3bf7ff.mp4"
                        : "https://cdn.scena.ai/project/9626/a5b5bdf1659991c0c74510ddfc59b9d27a3c7478f17c711b0fc39c5e51cf43d2.mp4"
                    }
                    autoPlay
                    loop={jobVideoState === "video1"}
                    muted={jobVideoMuted}
                    playsInline
                    onEnded={() => {
                      if (jobVideoState === "video2") {
                        setJobVideoState("video1");
                        setJobVideoMuted(true);
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      zIndex: 10,
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (jobVideoState === "video1") {
                            setJobVideoState("video2");
                            setJobVideoMuted(false);
                          } else {
                            setJobVideoState("video1");
                            setJobVideoMuted(true);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          background: jobVideoState === "video1" ? "rgba(0, 102, 255, 0.7)" : "rgba(239, 68, 68, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          backdropFilter: "blur(8px)",
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <span>{jobVideoState === "video1" ? "Xem hành trình" : "Hủy"}</span>
                        {jobVideoState === "video1" ? <Icons.ChevronRightIcon size={14} /> : <Icons.XMarkIcon size={14} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobVideoMuted(!jobVideoMuted);
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backdropFilter: "blur(8px)"
                        }}
                      >
                        {jobVideoMuted ? (
                          <Icons.SpeakerOffIcon size={14} style={{ color: "#fff" }} />
                        ) : (
                          <Icons.SpeakerWaveIcon size={14} style={{ color: "#22c55e" }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="job-card-scrollable-content no-scrollbar">
                  {/* Row 1: Date Range & Logo/Company */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      minHeight: "55.714299999999994px",
                      height: "auto",
                      marginBottom: "0.5rem",
                      fontWeight: "bold",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginBottom: "0px",
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: "53.4286px", justifyContent: 'center' }}>
                        {activeJob.key === 'jobsearch' ? (
                          <div
                            style={{
                              padding: "8px 18px",
                              borderRadius: "999px",
                              background: "linear-gradient(135deg, #0054A6 0%, #F15A24 20%, #009E49 40%, #D81B60 60%, #ED1C24 80%, #A50064 100%)",
                              color: "white",
                              fontWeight: "900",
                              fontSize: "14px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 8px 20px rgba(0,0,0,0.2), 0 0 10px rgba(var(--accent-color-rgb), 0.3)",
                              border: "2px solid rgba(255, 255, 255, 0.4)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            JOB 2026
                          </div>
                        ) : activeJob.logos ? (
                          activeJob.logos.map((logo, idx) => (
                            <div
                              key={idx}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                backgroundColor: "white",
                                padding: "4px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                border: `2px solid ${resolveSolidColor(activeJob.color)}`,
                                ...(idx > 0 ? {
                                  marginRight: "0px",
                                  marginBottom: "0px",
                                  paddingBottom: "0px",
                                  marginLeft: "-2px",
                                  marginTop: "19px",
                                } : {}),
                              }}
                            >
                              <img
                                src={logo}
                                alt={`${activeJob.company} logo ${idx}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                }}
                                className="object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))
                        ) : (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              backgroundColor: "white",
                              padding: "4px",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              border: `2px solid ${resolveSolidColor(activeJob.color)}`,
                            }}
                          >
                            <img
                              src={activeJob.logoUrl}
                              alt={activeJob.company}
                              style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "50%",
                                }}
                                className="object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "2px",
                        height: "66.545px",
                        width: "400px",
                      }}
                    >
                      {(() => {
                        const companyStr = activeJob.company;
                        const hasParensVi = companyStr.includes(" (");
                        const hasParensEn = companyStr.includes(" - (");
                        
                        if (hasParensVi) {
                          const idx = companyStr.indexOf(" (");
                          const main = companyStr.substring(0, idx);
                          const sub = companyStr.substring(idx).trim();
                          return (
                            <>
                              <h4
                                className="text-[24px] font-extrabold m-0 tracking-tight leading-tight"
                                style={{ ...getCompanyColorStyle(activeJob.color), fontSize: "24px", marginBottom: "0px", marginTop: "0px" }}
                              >
                                {main}
                              </h4>
                              <span
                                className="text-sm font-semibold opacity-85 mt-1"
                                style={{ ...getCompanyColorStyle(activeJob.color), marginLeft: "0px", paddingTop: "0px", marginTop: "0px", marginBottom: "0px", fontSize: "18.372px" }}
                              >
                                {sub}
                              </span>
                            </>
                          );
                        } else if (hasParensEn) {
                          const idx = companyStr.indexOf(" - (");
                          const main = companyStr.substring(0, idx);
                          const sub = companyStr.substring(idx + 3).trim();
                          return (
                            <>
                              <h4
                                className="text-[24px] font-extrabold m-0 tracking-tight leading-tight"
                                style={{ ...getCompanyColorStyle(activeJob.color), fontSize: "24px", marginBottom: "0px", marginTop: "0px" }}
                              >
                                {main}
                              </h4>
                              <span
                                className="text-sm font-semibold opacity-85 mt-1"
                                style={{ ...getCompanyColorStyle(activeJob.color), marginLeft: "0px", paddingTop: "0px", marginTop: "0px", marginBottom: "0px", fontSize: "18.372px" }}
                              >
                                {`(${sub}`}
                              </span>
                            </>
                          );
                        } else {
                          return (
                            <h4
                              className="text-[24px] font-extrabold m-0 tracking-tight leading-tight"
                              style={{ ...getCompanyColorStyle(activeJob.color), fontSize: "24px", marginBottom: "0px", marginTop: "0px" }}
                            >
                              {activeJob.company}
                            </h4>
                          );
                        }
                      })()}
                      <div className="flex flex-col gap-1 mt-1">
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                      style={{ 
                        height: "20px", 
                        color: "#000000",
                        fontSize: "18.372px",
                        marginLeft: "0px",
                        marginTop: "0px",
                        marginBottom: "57px",
                      }}
                    >
                      <Icons.CalendarDaysIcon
                        size={14}
                        className="shrink-0"
                        style={{ color: "#000000" }}
                      />
                      {formatJobDate(activeJob.date)}
                    </span>
                  </div>
                </div>

                <div className="mb-6"></div>

                  {/* Row 3.2: Tasks, Projects, and Achievements */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1.25rem 10px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {/* Header for Column 1 & 2: Vị trí */}
                    <div style={{ gridColumn: "1 / span 2", gridRow: "1" }}>
                      <h5
                        className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                        style={{
                          marginBottom: "0.25rem",
                          color: "#000000",
                          fontSize: "16px",
                          borderBottom: "1.5px solid rgba(0, 0, 0, 0.15)",
                          paddingBottom: "8px",
                        }}
                      >
                        <Icons.UserIcon
                          size={16}
                          style={{ paddingRight: "10px", color: "#000000" }}
                        />
                        {pageData.positionTitle || "Vị trí"}: {activeJob.title}
                      </h5>
                    </div>

                    {/* Header for Column 3: Quản lý */}
                    <div style={{ gridColumn: "3 / span 1", gridRow: "1" }}>
                      {activeJob.teamSize && activeJob.teamSize !== "N/A" && activeJob.teamSize !== "" && (
                        <h5
                          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                          style={{
                            marginBottom: "0.25rem",
                            color: "#000000",
                            fontSize: "16px",
                            borderBottom: "1.5px solid rgba(0, 0, 0, 0.15)",
                            paddingBottom: "8px",
                          }}
                        >
                          <Icons.UsersIcon
                            size={16}
                            style={{ paddingRight: "10px", color: "#000000" }}
                          />
                          {pageData.managedTitle || "Quản lý"}: {activeJob.teamSize}
                        </h5>
                      )}
                    </div>
                    <div style={{ gridColumn: "1 / span 1", gridRow: "2", width: "300.35699999999997px" }}>
                      <h5
                        className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                        style={{
                          marginTop: "0px",
                          marginBottom: "0px",
                          color: "#000000",
                          fontSize: "16px",
                        }}
                      >
                        <Icons.ClipboardDocumentListIcon
                          size={16}
                          style={{ paddingRight: "10px", color: "#000000" }}
                        />
                        {pageData.tasksTitle || pageData.descriptionTitle}
                      </h5>
                      <ul
                        className="popup-responsibilities"
                        style={{
                          borderTop: "none",
                          paddingTop: 0,
                          listStyleType: "decimal",
                          paddingLeft: "1.5rem",
                        }}
                      >
                        {(activeJob.tasks || activeJob.responsibilities).map(
                          (item, index) => (
                            <li
                              key={index}
                              style={{
                                marginBottom: "0px",
                                fontSize: "0.85rem",
                                lineHeight: "1.4",
                                color: "#000000",
                              }}
                            >
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div style={{ gridColumn: "2 / span 1", gridRow: "2" }}>
                      {activeJob.achievements.length > 0 && (
                        <div className="achievements-vertical-list">
                          <h5
                            className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                            style={{
                              marginTop: "0px",
                              marginBottom: "0px",
                              color: "#000000",
                              fontSize: "16px",
                            }}
                          >
                            <Icons.TrophyIcon
                              size={16}
                              style={{
                                marginLeft: "0px",
                                paddingTop: "0px",
                                marginRight: "10px",
                                color: "#000000",
                              }}
                            />
                            {pageData.achievementsTitle}
                          </h5>
                          <ul
                            className="popup-responsibilities"
                            style={{
                              borderTop: "none",
                              paddingTop: 0,
                              listStyle: "none",
                              paddingLeft: "0px",
                            }}
                          >
                            {activeJob.achievements.map((ach, index) => (
                              <li
                                key={index}
                                style={{
                                  marginBottom: "0.4rem",
                                  fontSize: "0.85rem",
                                  lineHeight: "1.4",
                                  color: "#000000",
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#000000",
                                    flexShrink: 0,
                                    marginTop: "2px",
                                  }}
                                >
                                  {getAchievementIcon(ach.label)}
                                </span>
                                <div>
                                  {ach.label}
                                  <span
                                    className="font-bold ml-2 whitespace-nowrap"
                                    style={{
                                      color: "#000000",
                                      paddingTop: "0px",
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {ach.value}%
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div style={{ gridColumn: "3 / span 1", gridRow: "2" }}>
                      {activeJob.projects && activeJob.projects.length > 0 && (
                        <div>
                          <h5
                            className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                            style={{
                              marginTop: "0px",
                              marginBottom: "0px",
                              color: "#000000",
                              fontSize: "16px",
                            }}
                          >
                            <Icons.FolderIcon
                              size={16}
                              style={{
                                marginLeft: "0px",
                                paddingTop: "0px",
                                marginRight: "10px",
                                color: "#000000",
                              }}
                            />
                            {pageData.projectsTitle}
                          </h5>
                          <div
                            className="popup-responsibilities"
                            style={{
                              borderTop: "none",
                              paddingTop: 0,
                              paddingLeft: 0,
                            }}
                          >
                            {activeJob.projects.map((item, index) => {
                              const cleanItemName = item
                                .replace(/^\d+\./, "")
                                .trim();
                              const vietnameseToEnglishProjectTitleMap: Record<
                                string,
                                string
                              > = {
                                "Xây dựng Phòng Dịch vụ Khách hàng":
                                  "Building a Customer Service Department",
                                "Thiết lập mục tiêu phòng ban":
                                  "Setting Departmental Goals",
                                "Thúc đẩy cải tiến sản phẩm":
                                  "Driving Product Improvement",
                                "Chuẩn hóa quy trình CSKH":
                                  "Standardizing CS Processes",
                                "Quản lý chiến dịch Outbound":
                                  "Managing Outbound Campaigns",
                                "Phân tích & Báo cáo": "Analysis & Reporting",
                                "Quản lý dự án CSKH": "CS Project Management",
                                "Xây dựng hệ thống CRM":
                                  "Building a CRM System",
                                "Phát triển đào tạo trực tuyến":
                                  "Developing Online Training",
                                "Thành lập Trung tâm Hỗ trợ Khách hàng":
                                  "Establishing a Help Center",
                                "Tối ưu hóa kênh hỗ trợ":
                                  "Optimizing Support Channels",
                                "Triển khai tự động hóa":
                                  "Implementing Automation",
                                "Xây dựng AI Bot": "Building an AI Bot",
                                "Khảo sát & Đánh giá khách hàng":
                                  "Customer Surveys & Assessment",
                                "Nâng cao trải nghiệm khách hàng":
                                  "Enhancing Customer Experience",
                              };

                              const englishTitle =
                                vietnameseToEnglishProjectTitleMap[
                                  cleanItemName
                                ] || cleanItemName;
                              const project = t.projectsPage.projects.find(
                                (p) =>
                                  p.title === englishTitle ||
                                  p.title === cleanItemName,
                              );
                              const projectKey = project
                                  ? `project-${project.id}`
                                  : null;
                              return (
                                <div
                                  key={index}
                                  style={{
                                    marginBottom: "0.4rem",
                                    fontSize: "0.85rem",
                                    lineHeight: "1.4",
                                  }}
                                >
                                  {projectKey && onNavigate ? (
                                    <button
                                      onClick={() => {
                                        sessionStorage.setItem(
                                          "referrer_experience",
                                          "true",
                                        );
                                        sessionStorage.setItem(
                                          "referrer_job_index",
                                          activeJobIndex.toString(),
                                        );
                                        onNavigate(projectKey);
                                      }}
                                      style={{
                                        color: "#000000",
                                        textDecoration: "underline",
                                        cursor: "pointer",
                                        background: "none",
                                        border: "none",
                                        textAlign: "left",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {item}
                                    </button>
                                  ) : (
                                    <span style={{ color: "#000000" }}>
                                      {item}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {activeJob.images && activeJob.images.length > 0 && (
                      <div
                        className="job-image-slider-wrapper"
                        style={{
                          gridColumn: "2 / span 2",
                          gridRow: "3",
                          marginTop: "0px",
                          borderTop:
                            "1px solid var(--color-brand-glass-border)",
                          paddingTop: "0px",
                          width: "100%",
                          height: "100px",
                          overflow: "hidden",
                        }}
                      >
                        <style>{`
                                                @keyframes marquee-l2r {
                                                    0% { transform: translateX(-50%); }
                                                    100% { transform: translateX(0%); }
                                                }
                                                .marquee-track {
                                                    display: flex;
                                                    width: max-content;
                                                    animation: marquee-l2r 20s linear infinite;
                                                    gap: 0.75rem;
                                                }
                                                .marquee-track:hover {
                                                    animation-play-state: paused;
                                                }
                                            `}</style>
                        <h5
                          className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                          style={{
                            color: activeJob.color,
                            marginTop: "0px",
                            marginBottom: "8px",
                          }}
                        >
                          <Icons.PhotoIcon size={16} />
                          {pageData.relatedImagesTitle}
                        </h5>
                        <div style={{ overflow: "hidden", width: "100%" }}>
                          <div className="marquee-track">
                            {[
                              ...activeJob.images,
                              ...activeJob.images,
                              ...activeJob.images,
                              ...activeJob.images,
                            ].map((src, index) => {
                              const originalIndex =
                                index % activeJob.images.length;
                              return (
                                <div
                                  key={index}
                                  className="transform hover:scale-[1.05] transition-all duration-300 cursor-pointer shrink-0"
                                  onClick={() =>
                                    handleOpenLightbox(originalIndex)
                                  }
                                  style={{ width: "110px", height: "60px" }}
                                >
                                  <OptimizedImage
                                    src={src}
                                    alt={`Work sample ${originalIndex + 1}`}
                                    loading="lazy"
                                    style={{
                                      width: "110px",
                                      height: "60px",
                                      borderRadius: "8px",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {showVideoPopup &&
        document.getElementById("popup-root") &&
        createPortal(
          <div
            className="video-popup-overlay"
            onClick={() => setShowVideoPopup(false)}
          >
            <div
              className="video-popup-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="video-popup-close-btn"
                onClick={() => setShowVideoPopup(false)}
                aria-label="Close video"
              >
                <Icons.XMarkIcon />
              </button>
              <video
                src={videoUrl}
                controls
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          </div>,
          document.getElementById("popup-root")!,
        )}
      {showCompanyPopup &&
        selectedJobForPopup &&
        document.getElementById("popup-root") &&
        createPortal(
          <div
            className="video-popup-overlay"
            style={{ zIndex: 9999 }}
            onClick={() => setShowCompanyPopup(false)}
          >
            <div
              className="experience-popup-content"
              style={{
                maxHeight: "90vh",
                overflowY: "hidden",
                padding: selectedJobForPopup.key === 'jobsearch' ? '0px' : "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: selectedJobForPopup.key === 'jobsearch' ? '90vw' : undefined,
                maxWidth: selectedJobForPopup.key === 'jobsearch' ? '500px' : undefined,
                height: selectedJobForPopup.key === 'jobsearch' ? '300px' : undefined,
                background: selectedJobForPopup.key === 'jobsearch' ? '#000000' : undefined,
                borderRadius: '24px',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {selectedJobForPopup.key === 'jobsearch' ? (
                <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <button
                    className="video-popup-close-btn"
                    onClick={() => setShowCompanyPopup(false)}
                    style={{ top: "1rem", right: "1rem", zIndex: 20, background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                  >
                    <Icons.XMarkIcon />
                  </button>
                  <video
                    key={jobVideoState}
                    src={
                      jobVideoState === "video1"
                        ? "https://cdn.scena.ai/project/9626/d97de7f6bb813019350838499ee0f3b11f711487c7d9961679f3a43d8a3bf7ff.mp4"
                        : "https://cdn.scena.ai/project/9626/a5b5bdf1659991c0c74510ddfc59b9d27a3c7478f17c711b0fc39c5e51cf43d2.mp4"
                    }
                    autoPlay
                    loop={jobVideoState === "video1"}
                    muted={jobVideoMuted}
                    playsInline
                    onEnded={() => {
                      if (jobVideoState === "video2") {
                        setJobVideoState("video1");
                        setJobVideoMuted(true);
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      zIndex: 10,
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (jobVideoState === "video1") {
                            setJobVideoState("video2");
                            setJobVideoMuted(false);
                          } else {
                            setJobVideoState("video1");
                            setJobVideoMuted(true);
                          }
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 16px",
                          borderRadius: "999px",
                          background: jobVideoState === "video1" ? "rgba(0, 102, 255, 0.7)" : "rgba(239, 68, 68, 0.7)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          backdropFilter: "blur(8px)",
                          color: "#ffffff",
                          fontWeight: "bold",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        <span>{jobVideoState === "video1" ? "Xem hành trình" : "Hủy"}</span>
                        {jobVideoState === "video1" ? <Icons.ChevronRightIcon size={14} /> : <Icons.XMarkIcon size={14} />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobVideoMuted(!jobVideoMuted);
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backdropFilter: "blur(8px)"
                        }}
                      >
                        {jobVideoMuted ? (
                          <Icons.SpeakerOffIcon size={14} style={{ color: "#fff" }} />
                        ) : (
                          <Icons.SpeakerWaveIcon size={14} style={{ color: "#22c55e" }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className="video-popup-close-btn"
                    onClick={() => setShowCompanyPopup(false)}
                    style={{ top: "1rem", right: "1rem" }}
                  >
                    <Icons.XMarkIcon />
                  </button>

              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "white",
                    padding: "6px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: `2px solid ${resolveSolidColor(selectedJobForPopup.color)}`,
                  }}
                >
                  <img
                    src={selectedJobForPopup.logoUrl}
                    alt={selectedJobForPopup.company}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {(() => {
                    const companyStr = selectedJobForPopup.company;
                    const hasParensVi = companyStr.includes(" (");
                    const hasParensEn = companyStr.includes(" - (");
                    if (hasParensVi) {
                      const idx = companyStr.indexOf(" (");
                      return (
                        <>
                          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 'bold', ...getCompanyColorStyle(selectedJobForPopup.color) }}>
                            {companyStr.substring(0, idx)}
                          </h3>
                          <span style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8, ...getCompanyColorStyle(selectedJobForPopup.color), marginTop: "2px" }}>
                            {companyStr.substring(idx).trim()}
                          </span>
                        </>
                      );
                    } else if (hasParensEn) {
                      const idx = companyStr.indexOf(" - (");
                      return (
                        <>
                          <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 'bold', ...getCompanyColorStyle(selectedJobForPopup.color) }}>
                            {companyStr.substring(0, idx)}
                          </h3>
                          <span style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.8, ...getCompanyColorStyle(selectedJobForPopup.color), marginTop: "2px" }}>
                            {`(${companyStr.substring(idx + 3).trim()}`}
                          </span>
                        </>
                      );
                    }
                    return (
                      <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 'bold', ...getCompanyColorStyle(selectedJobForPopup.color) }}>
                        {selectedJobForPopup.company}
                      </h3>
                    );
                  })()}
                  <div className="flex items-center gap-2 flex-wrap opacity-90">
                    <div className="flex items-center gap-1.5">
                      <Icons.UserIcon size={13} style={{ color: resolveSolidColor(selectedJobForPopup.color) }} />
                      <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: resolveSolidColor(selectedJobForPopup.color) }}>
                        {pageData.positionTitle || "Vị trí"}: {selectedJobForPopup.title}
                      </span>
                    </div>
                    {selectedJobForPopup.teamSize && selectedJobForPopup.teamSize !== "N/A" && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600 font-bold">|</span>
                        <div className="flex items-center gap-1.5">
                          <Icons.UsersIcon size={13} style={{ color: resolveSolidColor(selectedJobForPopup.color) }} />
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: resolveSolidColor(selectedJobForPopup.color) }}>
                            {pageData.managedTitle || "Quản lý"}: {selectedJobForPopup.teamSize}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <p
                    style={{
                      margin: "2px 0 0",
                      color: "var(--color-brand-text-secondary)",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    {selectedJobForPopup.date}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-[10px] mt-2">

                <div>
                  <h5 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                    {pageData.descriptionTitle}
                  </h5>
                  {selectedJobForPopup.responsibilities.map((resp, idx) => (
                    <p key={idx} className="mb-2 leading-relaxed">
                      {resp}
                    </p>
                  ))}
                </div>

                {selectedJobForPopup.tasks &&
                  selectedJobForPopup.tasks.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                        {pageData.tasksTitle}
                      </h5>
                      <ul className="popup-responsibilities">
                        {selectedJobForPopup.tasks.map((task, idx) => (
                          <li key={idx} className="mb-1">
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {selectedJobForPopup.achievements &&
                  selectedJobForPopup.achievements.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                        {pageData.achievementsTitle}
                      </h5>
                      <div className="achievements-grid mt-2">
                        {selectedJobForPopup.achievements.map(
                          (achievement, idx) => (
                            <JobAchievementCard
                              key={idx}
                              achievement={achievement}
                              color={resolveSolidColor(selectedJobForPopup.color)}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {selectedJobForPopup.projects &&
                  selectedJobForPopup.projects.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold uppercase tracking-wider mb-2 opacity-70">
                        {pageData.projectsTitle}
                      </h5>
                      <ul className="popup-responsibilities">
                        {selectedJobForPopup.projects.map((project, idx) => (
                          <li key={idx} className="mb-1">
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          </div>,
          document.getElementById("popup-root")!,
        )}
      {lightboxIndex !== null &&
        lightboxImages.length > 0 &&
        document.getElementById("popup-root") &&
        createPortal(
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={handleCloseLightbox}
            onNext={handleNextLightbox}
            onPrev={handlePrevLightbox}
          />,
          document.getElementById("popup-root")!,
        )}
    </PageLayout>
  );
};
export default WorkExperiencePage;