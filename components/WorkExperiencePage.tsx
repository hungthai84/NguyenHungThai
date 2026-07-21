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
import { useTheme } from "../contexts/ThemeContext";
import * as Icons from "./Icons";
import PageLayout from "./PageLayout";
import CardTitle from "./CardTitle";
import Lightbox from "./Lightbox";
import OptimizedImage from "./OptimizedImage";
import GlassButton from "./GlassButton";

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
          height: "18px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <span
          className="job-achievement-card-label"
          style={{ fontSize: "13.8924px", lineHeight: "1" }}
        >
          {achievement.label}
        </span>
        <span
          className="job-achievement-card-value"
          style={{ fontSize: "13.8924px", lineHeight: "1" }}
        >
          {achievement.value}%
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
const JobCardItem: React.FC<{
  job: Job;
  idx: number;
  onClick: () => void;
  pageData: any;
}> = ({ job, idx, onClick, pageData }) => {
  const { language } = useI18n();
  const isGradient = job.color === "gradient-2026";
  const accentColor = isGradient ? "#00C853" : job.color;

  return (
    <div
      onClick={onClick}
      className="project-card-new h-full flex flex-col group cursor-pointer overflow-hidden rounded-[16px] bg-[var(--card-bg)] shadow-[var(--card-box-shadow)] backdrop-blur-md border border-[var(--color-brand-glass-border)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      role="button"
      tabIndex={0}
      aria-label={`Xem chi tiết kinh nghiệm: ${job.title} tại ${job.company}`}
    >
      {/* Banner Image: Hidden on mobile, shown on tablet/desktop */}
      <div className="project-card-new-image relative w-full aspect-video overflow-hidden shrink-0 bg-slate-900/40 hidden sm:block">
        <OptimizedImage
          src={job.images?.[0] || job.logoUrl}
          alt={job.company}
          optWidth={600}
          optQuality={70}
          hoverScale
        />

        {/* Company Badge - Top Left */}
        {job.company && (
          <div
            className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-md text-xs font-semibold text-white shadow-md backdrop-blur-md"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(255, 255, 255, 0.2)" }}
          >
            {job.company}
          </div>
        )}

        {/* Period Badge - Top Right */}
        {job.period && (
          <div
            className="absolute top-2 right-2 z-10 px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-md backdrop-blur-md"
            style={{ backgroundColor: `${accentColor}CC`, border: "1px solid rgba(255, 255, 255, 0.3)" }}
          >
            {job.period}
          </div>
        )}

        {/* Team Size / Date - Bottom Left */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 z-10 pr-2">
          {job.teamSize && (
            <span
              className="whitespace-nowrap text-[10.5px] px-2 py-1 leading-none font-medium text-white shadow-sm backdrop-blur-md rounded-md flex items-center gap-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
            >
              <Icons.UsersIcon size={11} />
              {job.teamSize}
            </span>
          )}
          {job.date && (
            <span
              className="whitespace-nowrap text-[10.5px] px-2 py-1 leading-none font-medium text-white/80 shadow-sm backdrop-blur-md rounded-md flex items-center gap-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", border: "1px solid rgba(255, 255, 255, 0.15)" }}
            >
              <Icons.CalendarDaysIcon size={11} />
              {job.date}
            </span>
          )}
        </div>
      </div>

      <div className="project-card-new-content relative flex flex-col flex-1 p-3 sm:p-4">
        {/* Mobile-Only Header: Shown when banner is hidden */}
        <div className="flex items-center gap-2.5 sm:hidden mb-2.5">
          <img 
            src={job.logoUrl} 
            alt={job.company} 
            className="w-9 h-9 rounded-full object-cover border border-white/20 bg-white/90 p-0.5 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h5 className="font-bold text-[12.5px] leading-tight truncate" style={{ color: "var(--text-primary)" }}>{job.company}</h5>
            <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{job.period}</span>
          </div>
        </div>

        <h4 className="project-card-new-title m-0 mb-1 pr-2 font-bold text-[14.5px] sm:text-[16px] leading-[1.3] line-clamp-2" style={{ color: "var(--text-primary)" }}>
          <span className="project-card-new-id mr-1" style={{ color: accentColor }}>{idx + 1}.</span>
          {job.title}
        </h4>

        {/* Metadata Row: Hidden on mobile (since header shows info) */}
        <div className="hidden sm:flex flex-wrap items-center gap-2 mb-2.5 text-xs">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            <Icons.BriefcaseIcon size={11} />
            {job.company}
          </span>
          {job.period && (
            <span className="text-white/60 dark:text-white/50 text-[11px] font-medium bg-white/5 dark:bg-white/5 px-2 py-0.5 rounded border border-white/10 dark:border-white/5">
              {job.period}
            </span>
          )}
        </div>

        {/* Responsibilities Preview */}
        <div className="space-y-1 sm:space-y-1.5 mb-2.5 sm:mb-3 flex-1">
          {job.responsibilities.slice(0, 2).map((resp, rIdx) => (
            <div key={rIdx} className="flex items-start gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <Icons.CheckIcon size={12} className="text-emerald-400 shrink-0 mt-1" />
              <span className="line-clamp-1 sm:line-clamp-2">{resp}</span>
            </div>
          ))}
        </div>

        {/* Achievements / Footer Hashtags */}
        {job.achievements && job.achievements.length > 0 && (
          <div className="mt-auto pt-2 sm:pt-2.5 border-t border-white/10 dark:border-white/5 flex flex-wrap gap-1 sm:gap-1.5">
            {job.achievements.map((ach, aIdx) => (
              <span
                key={aIdx}
                className="text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 font-medium rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 inline-flex items-center gap-1"
              >
                <Icons.TrophyIcon size={10} className="text-amber-400" />
                {ach.label}: {ach.value}%
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterDropdown: React.FC<{
  title: string;
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (value: string) => void;
  icon: React.ReactNode;
  itemPrefix?: string;
}> = ({ title, options, selectedOptions, onSelectionChange, icon, itemPrefix = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-dropdown-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: "'Play', sans-serif" }}
      >
        {icon}
        <span style={{ fontFamily: "'Play', sans-serif" }}>
          {title} {selectedOptions.length > 0 ? `(${selectedOptions.length})` : ""}
        </span>
        <Icons.ChevronDownIcon
          size={16}
          className={`chevron-icon ${isOpen ? "open" : ""}`}
        />
      </button>
      {isOpen && (
        <div
          className="filter-dropdown-panel no-scrollbar"
          style={{ fontFamily: "'Play', sans-serif" }}
        >
          {options.map((option) => (
            <label
              key={option}
              className="filter-dropdown-item"
              style={{ fontFamily: "'Play', sans-serif" }}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onSelectionChange(option)}
              />
              <span style={{ fontFamily: "'Play', sans-serif" }}>
                {itemPrefix}
                {option}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const WorkExperiencePage: React.FC<WorkExperiencePageProps> = ({
  id,
  onNavigate,
  isForPrint = false,
}) => {
  
  const { t, language } = useI18n();
  const pageData = t.workExperiencePage || { jobs: [] };
  const jobs: Job[] = useMemo(
    () => [...(pageData.jobs || [])],
    [pageData.jobs],
  );

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedTeamSizes, setSelectedTeamSizes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const roleOptions = useMemo(() => {
    return language === "vi"
      ? ["Trưởng Phòng", "Trưởng Nhóm", "Tổng đài viên"]
      : ["Department Head", "Team Lead", "Agent"];
  }, [language]);

  const teamSizeOptions = useMemo(() => {
    return language === "vi"
      ? [
          "Quy mô nhỏ (< 20 người)",
          "Quy mô vừa (20 - 100 người)",
          "Quy mô lớn (> 100 người)",
        ]
      : [
          "Small (< 20 people)",
          "Medium (20 - 100 people)",
          "Large (> 100 people)",
        ];
  }, [language]);

  const domainOptions = useMemo(() => {
    return language === "vi"
      ? [
          "Viễn thông & Truyền hình",
          "Fintech & Ví điện tử",
          "Bảo hiểm nhân thọ",
          "eSports & Thương mại điện tử",
        ]
      : [
          "Telecom & Cable TV",
          "Fintech & E-Wallet",
          "Life Insurance",
          "eSports & E-commerce",
        ];
  }, [language]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Role Filter
      const matchesRole = () => {
        if (selectedRoles.length === 0) return true;
        return selectedRoles.some((role) => {
          const titleLower = job.title.toLowerCase();
          if (role === "Trưởng Phòng" || role === "Department Head") {
            return (
              titleLower.includes("trưởng phòng") ||
              titleLower.includes("head") ||
              titleLower.includes("manager")
            );
          }
          if (role === "Trưởng Nhóm" || role === "Team Lead") {
            return (
              titleLower.includes("trưởng nhóm") ||
              titleLower.includes("lead") ||
              titleLower.includes("leader")
            );
          }
          if (role === "Tổng đài viên" || role === "Agent") {
            return (
              titleLower.includes("tổng đài viên") ||
              titleLower.includes("agent") ||
              titleLower.includes("nhân viên")
            );
          }
          return false;
        });
      };

      // 2. Team Size Filter
      const parseNum = (sizeStr: string): number => {
        const match = sizeStr.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      };
      const matchesTeamSize = () => {
        if (selectedTeamSizes.length === 0) return true;
        const num = parseNum(job.teamSize);
        return selectedTeamSizes.some((size) => {
          if (
            size.includes("< 20") ||
            size.includes("nhỏ") ||
            size.includes("Small")
          ) {
            return num < 20;
          }
          if (
            size.includes("20 - 100") ||
            size.includes("vừa") ||
            size.includes("Medium")
          ) {
            return num >= 20 && num <= 100;
          }
          if (
            size.includes("> 100") ||
            size.includes("lớn") ||
            size.includes("Large")
          ) {
            return num > 100;
          }
          return false;
        });
      };

      // 3. Domain Filter
      const matchesDomain = () => {
        if (selectedDomains.length === 0) return true;
        return selectedDomains.some((domain) => {
          const key = job.key.toLowerCase();
          if (domain.includes("Viễn thông") || domain.includes("Telecom")) {
            return key === "mobifone" || key === "v247" || key === "lbc";
          }
          if (domain.includes("Fintech") || domain.includes("Ví điện tử")) {
            return key === "mservice" || key === "finviet" || key === "ved";
          }
          if (domain.includes("Bảo hiểm") || domain.includes("Insurance")) {
            return key === "prudential";
          }
          if (domain.includes("eSports") || domain.includes("Thương mại")) {
            return key === "ved";
          }
          return false;
        });
      };

      return matchesRole() && matchesTeamSize() && matchesDomain();
    });
  }, [jobs, selectedRoles, selectedTeamSizes, selectedDomains]);

  const resolveSolidColor = (colorStr: string): string => {
    if (colorStr === "gradient-2026") {
      return "#00C853";
    }
    return colorStr;
  };

  const getCompanyColorStyle = (colorStr: string): React.CSSProperties => {
    if (colorStr === "gradient-2026") {
      return {
        backgroundImage: "linear-gradient(90deg, #00C853 0%, #A8E631 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
      };
    }
    return { color: colorStr };
  };

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
  const [jobVideoState, setJobVideoState] = useState<"video1" | "video2">(
    "video1",
  );
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
    if (!isAutoPlaying || isForPrint || filteredJobs.length === 0 || isMobile) return;

    const interval = setInterval(() => {
      setActiveJobIndex((prev) => {
        const next = prev + 1;
        if (next >= filteredJobs.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        playClickSound(); // Play sound on auto-switch
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredJobs.length, isForPrint, isMobile]);

  // Safe reset for activeJobIndex bounds when filteredJobs updates
  useEffect(() => {
    if (filteredJobs.length === 0) {
      setActiveJobIndex(0);
    } else if (activeJobIndex >= filteredJobs.length) {
      setActiveJobIndex(filteredJobs.length - 1);
    }
  }, [filteredJobs, activeJobIndex]);

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
    milestoneRefs.current = milestoneRefs.current.slice(0, filteredJobs.length);
  }, [filteredJobs]);

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
        resolveSolidColor(filteredJobs[activeJobIndex]?.color || "var(--accent-color)"),
      );
      container.style.setProperty("--timeline-opacity", "1");
    });
  }, [activeJobIndex, isForPrint, filteredJobs]);

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
    return dateString.replace(/(\d{4})\s*-\s*(\d{4})/, "Từ Năm $1 đến Năm $2");
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

          {isLoading && !isForPrint && (
            <div
              className="experience-layout"
              style={{
                height: "400px",
                display: "flex",
                gap: "20px",
                width: "100%",
                padding: "20px",
              }}
            >
              <div
                style={{
                  width: "200px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  flexShrink: 0,
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse"
                    style={{
                      width: "100%",
                      height: "40px",
                      backgroundColor: "var(--card-bg, rgba(255,255,255,0.05))",
                      borderRadius: "10px",
                    }}
                  />
                ))}
              </div>
              <div
                className="animate-pulse experience-item"
                style={{
                  flex: 1,
                  height: "100%",
                  backgroundColor: "var(--card-bg, rgba(255,255,255,0.05))",
                  borderRadius: "20px",
                }}
              />
            </div>
          )}
          <div
            className="experience-layout no-scrollbar"
            style={{ display: isLoading ? "none" : "" }}
          >
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
                            <h4 style={{ margin: 0 }}>
                              {companyStr.substring(0, idx)}
                            </h4>
                            <div
                              style={{
                                fontSize: "0.85em",
                                opacity: 0.8,
                                marginTop: "2px",
                              }}
                            >
                              {companyStr.substring(idx).trim()}
                            </div>
                          </>
                        );
                      } else if (hasParensEn) {
                        const idx = companyStr.indexOf(" - (");
                        return (
                          <>
                            <h4 style={{ margin: 0 }}>
                              {companyStr.substring(0, idx)}
                            </h4>
                            <div
                              style={{
                                fontSize: "0.85em",
                                opacity: 0.8,
                                marginTop: "2px",
                              }}
                            >
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

  const activeJob = filteredJobs[activeJobIndex] || filteredJobs[0];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    setCurrentImageIndex(0);
    if (activeJob && activeJob.images && activeJob.images.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % activeJob.images!.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeJob]);
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
      setSelectedJobForPopup(filteredJobs[index]);
      setShowCompanyPopup(true);
    }
  };
  return (
    <>
      <style>{`
        #experience div:nth-of-type(3) > div:nth-of-type(4) {
          height: auto !important;
        }
      `}</style>
      <PageLayout
        id={id}
        className="work-experience-section"
        innerStyle={{ borderRadius: "16px" }}
      >
        <div
          className="info-card no-padding work-experience-card flex flex-col h-full !p-0"
          style={{
            position: "relative",
          }}
        >
          {/* Card Header with Title */}
          <div
            style={{
              padding: "24px 24px 0 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              width: "100%"
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

          {/* Integrated Filter controls wrapper (matching Projects Page) */}
          <div className="projects-controls-wrapper" style={{ padding: "0 24px", marginBottom: "1.5rem" }}>
            <div className="projects-main-controls">
              <div className="project-filters-group">
                <FilterDropdown
                  title={language === 'vi' ? 'Vị trí / Cấp bậc' : 'Position / Level'}
                  options={roleOptions}
                  selectedOptions={selectedRoles}
                  onSelectionChange={(role) => {
                    setSelectedRoles(prev => 
                      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
                    );
                    playClickSound();
                  }}
                  icon={<Icons.FilterIcon size={18} />}
                />
                <FilterDropdown
                  title={language === 'vi' ? 'Quy mô đội ngũ' : 'Team Size'}
                  options={teamSizeOptions}
                  selectedOptions={selectedTeamSizes}
                  onSelectionChange={(size) => {
                    setSelectedTeamSizes(prev => 
                      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
                    );
                    playClickSound();
                  }}
                  icon={<Icons.LayersIcon size={18} />}
                />
                <FilterDropdown
                  title={language === 'vi' ? 'Lĩnh vực' : 'Industry'}
                  options={domainOptions}
                  selectedOptions={selectedDomains}
                  onSelectionChange={(domain) => {
                    setSelectedDomains(prev => 
                      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
                    );
                    playClickSound();
                  }}
                  icon={<Icons.PencilIcon size={18} />}
                />
              </div>
            </div>
          </div>

          <div
            className="work-experience-cards-view grid grid-cols-2 grid-rows-4 gap-6 overflow-y-auto no-scrollbar pb-8 px-6"
            style={{ 
              flex: 1, 
              minHeight: 0,
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(4, auto)'
            }}
          >
            {filteredJobs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-white/50" style={{ fontFamily: "'Play', sans-serif" }}>
                <Icons.FilterIcon size={48} className="mb-4 opacity-50" />
                <p>{language === 'vi' ? 'Không tìm thấy kinh nghiệm làm việc phù hợp với bộ lọc.' : 'No work experience matches the current filters.'}</p>
              </div>
            ) : (
              filteredJobs.map((job, idx) => (
                <JobCardItem
                  key={idx}
                  job={job}
                  idx={idx}
                  pageData={pageData}
                  onClick={() => {
                    setSelectedJobForPopup(job);
                    setShowCompanyPopup(true);
                    playClickSound();
                  }}
                />
              ))
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
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
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
                  overflowY: "auto",
                  padding:
                    selectedJobForPopup.key === "jobsearch" ? "0px" : "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  width:
                    selectedJobForPopup.key === "jobsearch"
                      ? "90vw"
                      : undefined,
                  maxWidth:
                    selectedJobForPopup.key === "jobsearch"
                      ? "500px"
                      : undefined,
                  height:
                    selectedJobForPopup.key === "jobsearch"
                      ? "300px"
                      : undefined,
                  background:
                    selectedJobForPopup.key === "jobsearch"
                      ? "#000000"
                      : undefined,
                  borderRadius: "24px",
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedJobForPopup.key === "jobsearch" ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      className="video-popup-close-btn"
                      onClick={() => setShowCompanyPopup(false)}
                      style={{
                        top: "1rem",
                        right: "1rem",
                        zIndex: 20,
                        background: "rgba(0,0,0,0.5)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        color: "#fff",
                      }}
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
                        objectFit: "contain",
                      }}
                    />

                    <div
                      className="premium-intro-btn glass-btn"
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        zIndex: 10,
                        flexShrink: 0,
                        background:
                          jobVideoState === "video1"
                            ? "linear-gradient(135deg, var(--primary, #8A5CF6) 0%, var(--accent-color, #FF63C9) 100%)"
                            : "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(153, 27, 27, 0.9) 100%)",
                      }}
                    >
                      <div
                        className="premium-sound-toggle"
                        onClick={(e) => {
                          e.stopPropagation();
                          setJobVideoMuted(!jobVideoMuted);
                        }}
                        title={jobVideoMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                      >
                        {jobVideoMuted ? (
                          <Icons.SpeakerOffIcon
                            size={20}
                            style={{ color: "white" }}
                          />
                        ) : (
                          <Icons.SpeakerWaveIcon
                            size={20}
                            style={{ color: "white" }}
                            className="animate-pulse"
                          />
                        )}
                      </div>
                      <div
                        className="premium-main-toggle"
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
                        title={
                          jobVideoState === "video1"
                            ? "Hành trình kiến tạo"
                            : "Hủy bỏ"
                        }
                      >
                        <span className="premium-btn-text">
                          {jobVideoState === "video1"
                            ? "Hành trình kiến tạo"
                            : "Hủy bỏ"}
                        </span>
                        <div className="premium-btn-icon">
                          {jobVideoState === "video1" ? (
                            <Icons.PlayIcon size={20} />
                          ) : (
                            <Icons.XMarkIcon size={20} />
                          )}
                        </div>
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
                          loading="lazy"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {(() => {
                          const companyStr = selectedJobForPopup.company;
                          const hasParensVi = companyStr.includes(" (");
                          const hasParensEn = companyStr.includes(" - (");
                          if (hasParensVi) {
                            const idx = companyStr.indexOf(" (");
                            return (
                              <>
                                <h3
                                  style={{
                                    margin: 0,
                                    fontSize: "1.15rem",
                                    fontWeight: "bold",
                                    ...getCompanyColorStyle(
                                      selectedJobForPopup.color,
                                    ),
                                  }}
                                >
                                  {companyStr.substring(0, idx)}
                                </h3>
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    opacity: 0.8,
                                    ...getCompanyColorStyle(
                                      selectedJobForPopup.color,
                                    ),
                                    marginTop: "2px",
                                  }}
                                >
                                  {companyStr.substring(idx).trim()}
                                </span>
                              </>
                            );
                          } else if (hasParensEn) {
                            const idx = companyStr.indexOf(" - (");
                            return (
                              <>
                                <h3
                                  style={{
                                    margin: 0,
                                    fontSize: "1.15rem",
                                    fontWeight: "bold",
                                    ...getCompanyColorStyle(
                                      selectedJobForPopup.color,
                                    ),
                                  }}
                                >
                                  {companyStr.substring(0, idx)}
                                </h3>
                                <span
                                  style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                    opacity: 0.8,
                                    ...getCompanyColorStyle(
                                      selectedJobForPopup.color,
                                    ),
                                    marginTop: "2px",
                                  }}
                                >
                                  {`(${companyStr.substring(idx + 3).trim()}`}
                                </span>
                              </>
                            );
                          }
                          return (
                            <h3
                              style={{
                                margin: 0,
                                fontSize: "1.15rem",
                                fontWeight: "bold",
                                ...getCompanyColorStyle(
                                  selectedJobForPopup.color,
                                ),
                              }}
                            >
                              {selectedJobForPopup.company}
                            </h3>
                          );
                        })()}
                        <div className="flex items-center gap-2 flex-wrap opacity-90">
                          <div className="flex items-center gap-1.5">
                            <Icons.UserIcon
                              size={13}
                              style={{
                                color: resolveSolidColor(
                                  selectedJobForPopup.color,
                                ),
                              }}
                            />
                            <span
                              className="text-[11px] font-bold uppercase tracking-wider"
                              style={{
                                color: resolveSolidColor(
                                  selectedJobForPopup.color,
                                ),
                              }}
                            >
                              {pageData.positionTitle || "Vị trí"}:{" "}
                              {selectedJobForPopup.title}
                            </span>
                          </div>
                          {selectedJobForPopup.teamSize &&
                            selectedJobForPopup.teamSize !== "N/A" && (
                              <>
                                <span className="text-slate-300 dark:text-slate-600 font-bold">
                                  |
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <Icons.UsersIcon
                                    size={13}
                                    style={{
                                      color: resolveSolidColor(
                                        selectedJobForPopup.color,
                                      ),
                                    }}
                                  />
                                  <span
                                    className="text-[11px] font-bold uppercase tracking-wider"
                                    style={{
                                      color: resolveSolidColor(
                                        selectedJobForPopup.color,
                                      ),
                                    }}
                                  >
                                    {pageData.managedTitle || "Quản lý"}:{" "}
                                    {selectedJobForPopup.teamSize}
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
                        <h5
                          className="text-sm font-bold uppercase tracking-wider mb-0 opacity-70"
                          style={{
                            marginTop: "0px",
                            marginBottom: "0px",
                            paddingBottom: "0px",
                          }}
                        >
                          {pageData.descriptionTitle}
                        </h5>
                        {selectedJobForPopup.responsibilities.map(
                          (resp, idx) => (
                            <p key={idx} className="mb-2 leading-relaxed">
                              {resp}
                            </p>
                          ),
                        )}
                      </div>

                      {selectedJobForPopup.tasks &&
                        selectedJobForPopup.tasks.length > 0 && (
                          <div>
                            <h5
                              className="text-sm font-bold uppercase tracking-wider mb-0 opacity-70"
                              style={{
                                marginTop: "0px",
                                marginBottom: "0px",
                                paddingBottom: "0px",
                              }}
                            >
                              {pageData.tasksTitle}
                            </h5>
                            <ul
                              className="popup-tasks-list"
                              style={{ listStyle: "none", paddingLeft: 0 }}
                            >
                              {selectedJobForPopup.tasks.map((task, idx) => {
                                const matchNum = task.match(/^(\d+)\.\s*/);
                                const numPrefix = matchNum
                                  ? matchNum[1]
                                  : (idx + 1).toString();
                                const cleanText = task
                                  .replace(/^\d+\.\s*/, "")
                                  .replace(/\.$/, "")
                                  .trim();
                                return (
                                  <li
                                    key={idx}
                                    className="mb-1"
                                    style={{
                                      fontSize:
                                        idx === 1 ? "13.2732px" : "16px",
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: "8px",
                                      color:
                                        "var(--color-brand-text-primary, inherit)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontWeight: "bold",
                                        flexShrink: 0,
                                        minWidth: "1.2rem",
                                        color:
                                          "var(--color-brand-text-primary, inherit)",
                                      }}
                                    >
                                      {numPrefix}
                                    </span>
                                    <span style={{ paddingTop: "0px" }}>
                                      {cleanText}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                      {selectedJobForPopup.achievements &&
                        selectedJobForPopup.achievements.length > 0 && (
                          <div>
                            <h5 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">
                              {pageData.achievementsTitle}
                            </h5>
                            <div className="achievements-grid mt-2">
                              {selectedJobForPopup.achievements.map(
                                (achievement, idx) => (
                                  <JobAchievementCard
                                    key={idx}
                                    achievement={achievement}
                                    color={resolveSolidColor(
                                      selectedJobForPopup.color,
                                    )}
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      {selectedJobForPopup.projects &&
                        selectedJobForPopup.projects.length > 0 && (
                          <div>
                            <h5 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-70">
                              {pageData.projectsTitle}
                            </h5>
                            <ul
                              className="popup-projects-list"
                              style={{ listStyle: "none", paddingLeft: 0 }}
                            >
                              {selectedJobForPopup.projects.map(
                                (project, idx) => {
                                  const cleanItemName = project.replace(
                                    /^\d+\.\s*/,
                                    "",
                                  );
                                  const vietnameseToEnglishProjectTitleMap: Record<
                                    string,
                                    string
                                  > = {
                                    "Xây dựng P.CSKH":
                                      "Building a Customer Service Department",
                                    "Thiết lập mục tiêu phòng ban":
                                      "Department Goal Setting",
                                    "Thúc đẩy cải tiến sản phẩm":
                                      "Product Improvement Drive",
                                    "Chuẩn hóa quy trình CSKH":
                                      "Standardizing CS Processes",
                                    "Quản lý chiến dịch Outbound":
                                      "Outbound Campaign Management",
                                    "Phân tích & Báo cáo":
                                      "Analysis & Reporting",
                                    "Quản lý dự án CSKH":
                                      "CS Project Management",
                                    "Xây dựng hệ thống CRM":
                                      "CRM System Development",
                                    "Phát triển đào tạo trực tuyến":
                                      "Online Training Development",
                                    "Thành lập Trung tâm Hỗ trợ Khách hàng":
                                      "Establishing Customer Support Center",
                                  };

                                  const englishTitle =
                                    vietnameseToEnglishProjectTitleMap[
                                      cleanItemName
                                    ];
                                  const foundProject =
                                    t.projectsPage.projects.find(
                                      (p) =>
                                        p.title === englishTitle ||
                                        p.title === cleanItemName ||
                                        p.title === project,
                                    );

                                  const jobIndexForLink = jobs.findIndex(
                                    (j) => j.key === selectedJobForPopup.key,
                                  );
                                  const displayProjectTitle = foundProject
                                    ? foundProject.title
                                    : cleanItemName;
                                  const matchNum = project.match(/^(\d+)\./);
                                  const numPrefix = foundProject
                                    ? foundProject.id
                                    : matchNum
                                      ? matchNum[1]
                                      : (idx + 1).toString();

                                  return (
                                    <li
                                      key={idx}
                                      className="mb-2"
                                      style={{
                                        fontSize: "16px",
                                        fontFamily: "'Play', sans-serif",
                                        fontWeight: 500,
                                        color:
                                          "var(--color-brand-text-primary, inherit)",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "8px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          flexShrink: 0,
                                          minWidth: "1.2rem",
                                          color:
                                            "var(--color-brand-text-primary, inherit)",
                                        }}
                                      >
                                        {numPrefix}.
                                      </span>
                                      {foundProject ? (
                                        <button
                                          onClick={() => {
                                            if (onNavigate) {
                                              sessionStorage.setItem(
                                                "referrer_experience",
                                                "true",
                                              );
                                              sessionStorage.setItem(
                                                "referrer_job_index",
                                                jobIndexForLink.toString(),
                                              );
                                              onNavigate(
                                                `project-${foundProject.id}`,
                                              );
                                            }
                                          }}
                                          className="hover:underline text-left transition-all duration-300"
                                          style={{
                                            color:
                                              "var(--color-brand-text-primary, inherit)",
                                            background: "none",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                            fontSize: "inherit",
                                            fontWeight: "inherit",
                                          }}
                                        >
                                          {displayProjectTitle}
                                        </button>
                                      ) : (
                                        <span
                                          style={{
                                            color:
                                              "var(--color-brand-text-primary, inherit)",
                                          }}
                                        >
                                          {displayProjectTitle}
                                        </span>
                                      )}
                                    </li>
                                  );
                                },
                              )}
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
    </>
  );
};
export default WorkExperiencePage;
