sed -i '267,311c\
                                                <div key={item.key} className="flex flex-col items-start gap-2 p-4 rounded-xl border border-white/10 bg-white/5 shadow-sm w-full box-border hover:bg-white/10 transition-colors duration-300">\
                                                    <div className="flex items-center gap-3 shrink-0">\
                                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: `${iconColor}15`, color: iconColor }}>\
                                                            <Icon style={{ width: "16px", height: "16px" }} />\
                                                        </div>\
                                                        <span className="text-sm font-semibold" style={{ color: "var(--color-brand-text-secondary)" }}>\
                                                            {displayLabel}\
                                                        </span>\
                                                    </div>\
                                                    <div className="text-[0.95rem] font-bold break-words w-full pl-11 text-left flex flex-col" style={{ color: "var(--color-brand-text-primary)" }}>\
                                                        {item.link ? (\
                                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-inherit no-underline hover:opacity-80 transition-opacity">\
                                                                {displayValue}\
                                                            </a>\
                                                        ) : (\
                                                            displayValue\
                                                        )}\
                                                    </div>\
                                                </div>' components/AboutPage.tsx
