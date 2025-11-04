
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  titleAddon?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({title, icon, subtitle, children, titleAddon, className = ''}) => (
    <div className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 ${className}`}>
        <h3 className="text-xl font-semibold mb-1 flex items-center gap-2">
            {icon}
            {title}
            {titleAddon}
        </h3>
        {subtitle && <p className="text-xs text-slate-400 mb-4">{subtitle}</p>}
        {children}
    </div>
);

export default Card;
