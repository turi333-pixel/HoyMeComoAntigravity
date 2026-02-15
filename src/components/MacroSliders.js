'use client';

import { motion } from 'framer-motion';
import styles from './MacroSliders.module.css';

export default function MacroSliders({ macros, onChange, t }) {
    // macros: { protein, carbs, fat, calories }

    const handleChange = (key, value) => {
        onChange({ ...macros, [key]: Number(value) });
    };

    // Calculate donut segments (simple representation)
    const total = macros.protein + macros.carbs + macros.fat;
    const proteinPct = (macros.protein / total) * 100 || 33;
    const carbsPct = (macros.carbs / total) * 100 || 33;
    const fatPct = (macros.fat / total) * 100 || 33;

    return (
        <div className={styles.container}>
            <div className={styles.chartContainer}>
                {/* Simple CSS Conic Gradient Donut for MVP */}
                <div style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    background: `conic-gradient(
            var(--color-primary) 0% ${proteinPct}%,
            var(--color-accent) ${proteinPct}% ${proteinPct + carbsPct}%,
            var(--color-secondary) ${proteinPct + carbsPct}% 100%
          )`,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: 'white',
                    }} />
                    <div className={styles.donutText}>
                        <div className={styles.totalCalories}>{macros.calories}</div>
                        <div className={styles.label}>kcal</div>
                    </div>
                </div>
            </div>

            <div className={styles.sliders}>
                <SliderItem
                    label="Protein"
                    val={macros.protein}
                    min={10} max={200}
                    color="var(--color-primary)"
                    onChange={(v) => handleChange('protein', v)}
                />
                <SliderItem
                    label="Carbs"
                    val={macros.carbs}
                    min={10} max={300}
                    color="var(--color-accent)"
                    onChange={(v) => handleChange('carbs', v)}
                />
                <SliderItem
                    label="Fat"
                    val={macros.fat}
                    min={10} max={150}
                    color="var(--color-secondary)"
                    onChange={(v) => handleChange('fat', v)}
                />
                <SliderItem
                    label="Calories"
                    val={macros.calories}
                    min={300} max={1500}
                    color="var(--color-text)"
                    onChange={(v) => handleChange('calories', v)}
                />
            </div>
        </div>
    );
}

function SliderItem({ label, val, min, max, color, onChange }) {
    return (
        <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
                <span style={{ color }}>{label}</span>
                <span>{val}g</span>
            </div>
            <input
                type="range"
                min={min} max={max}
                value={val}
                onChange={(e) => onChange(e.target.value)}
                className={styles.sliderInput}
                style={{
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${(val - min) / (max - min) * 100}%, var(--color-border) ${(val - min) / (max - min) * 100}%, var(--color-border) 100%)`
                }}
            />
        </div>
    );
}
