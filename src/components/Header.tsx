import { Bell } from 'lucide-react';

interface HeaderProps {
  onNotifyClick: () => void;
  activeNotificationsCount: number;
}

export default function Header({ onNotifyClick, activeNotificationsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-outline-variant/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center overflow-hidden">
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOI4rQlgUONwEE0nNCcLvZ-SCpzZxcZYw-NLGQU8qVNywWy84mHJql_Qwk7nn4f9Rn6xmK7ROa8ezQPvEKJ6ggSlhDkfSKHxpl4y7amsn6IbqoLTflXauOLBGeQot0jO8_ua2PuNouSCZg7as2em6Sk95S-li_ypDxRqXtWDfPi_6jIwbJ3BlMaXl6_-_IJ9UT1eh8xVcWFqLZpHpoFKxLe-FI7yvsits_2DnQLsejkWlNZ5CEyFpChg6XzH67ykt9AZBalRdJNnQC"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-on-surface leading-none">EcoSync</h1>
          <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-label">Active Smart Grid</span>
        </div>
      </div>
      
      <button 
        id="notification-bell-btn"
        onClick={onNotifyClick}
        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors relative"
      >
        <Bell className="w-5 h-5 text-on-surface-variant" />
        {activeNotificationsCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background border border-white" />
        )}
      </button>
    </header>
  );
}
