export default function KanbanMock() {
    return (
        <div
            className="relative aspect-[5/4] w-full max-w-xl drop-shadow-2xl"
            style={{transform: 'rotate(6deg)'}}
            aria-hidden
        >
            <div className="absolute inset-0 overflow-hidden rounded-2xl bg-white ring-1 ring-stone-300">
                {/* Window chrome */}
                <div className="flex items-center gap-1.5 bg-stone-900 px-3 py-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400"/>
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-300"/>
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400"/>
                </div>

                {/* App header */}
                <div className="bg-amber-300 px-4 pt-3 pb-2">
                    <div className="h-3 w-32 rounded-full bg-amber-100/80"/>
                </div>

                {/* Board */}
                <div className="space-y-3 bg-yellow-50 p-4">
                    <div className="grid grid-cols-3 gap-3">
                        <Column accent="bg-amber-200"/>
                        <Column accent="bg-yellow-200"/>
                        <Column accent="bg-lime-200"/>
                    </div>
                    <div className="rounded-lg bg-yellow-100 p-3">
                        <div className="mb-2 h-2 w-24 rounded-full bg-amber-200"/>
                        <div className="h-2 w-40 rounded-full bg-amber-100"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Column({accent}) {
    return (
        <div className={`rounded-lg ${accent} p-3`}>
            <div className="mb-2 h-2 w-12 rounded-full bg-stone-900/30"/>
            <div className="h-2 w-16 rounded-full bg-stone-900/15"/>
        </div>
    )
}
