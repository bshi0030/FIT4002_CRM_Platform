import {cn} from '@/lib/utils'
import logo from '@/assets/CRM_logo.png'

export default function AppHeader({actions, className}) {
    return (
        <header
            className={cn(
                'flex items-center justify-between gap-4 bg-stone-300/90 px-6 py-3',
                className
            )}
        >
            <div className="flex items-center gap-4">
                <img
                    src={logo}
                    alt="NexGen CRM"
                    className="h-20 w-36 object-contain"
                />
                <div className="h-12 w-px bg-stone-500/40"/>
                <p className="text-base font-semibold text-stone-700">
                    Next Generation CRM Platform
                </p>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
    )
}
