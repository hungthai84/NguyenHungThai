sed -i '1s/^/import { Code2 } from "lucide-react";\nimport CodePenAnalyzer from ".\/components\/CodePenAnalyzer";\n/' App.tsx

# Add state for the panel
sed -i '/const \[activeIndex, setActiveIndex\] = useState(0);/a\
    const [isCodePenOpen, setIsCodePenOpen] = useState(false);\
' App.tsx

# Add the floating button and panel at the end, before <> and </>
sed -i '/<\/div>$/!b;n;/)}/!b;n;/<\/.*>/!b;i\
            <button \
                onClick={() => setIsCodePenOpen(true)}\
                className="fixed top-1\/2 right-0 -translate-y-1\/2 bg-[var(--accent-color)] text-white p-3 rounded-l-xl shadow-lg hover:pr-5 transition-all z-40 flex items-center gap-2 group"\
                title="CodePen Effects"\
            >\
                <Code2 size={20} />\
                <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 opacity-0 group-hover:opacity-100 font-semibold text-sm">\
                    Demo\
                </span>\
            </button>\
            <CodePenAnalyzer isOpen={isCodePenOpen} onClose={() => setIsCodePenOpen(false)} />\
' App.tsx
