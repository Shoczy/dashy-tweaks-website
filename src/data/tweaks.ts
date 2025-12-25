// Copy of tweak data from the app - keep in sync!

export interface Tweak {
    id: string
    name: string
    title: string
    description: string
    category: string
    premium: boolean
}

export interface TweakCategory {
    id: string
    name: string
    icon: string
    description: string
    premium: boolean
}

export const categories: TweakCategory[] = [
    { id: 'fps', name: 'FPS Boost', icon: '⚡', description: 'Maximize your frames per second', premium: false },
    { id: 'input', name: 'Input Delay', icon: '🎮', description: 'Reduce input latency for faster response', premium: false },
    { id: 'network', name: 'Network', icon: '🌐', description: 'Optimize network for lower ping', premium: false },
    { id: 'gpu', name: 'GPU Tweaks', icon: '🖥️', description: 'Optimize graphics card performance', premium: true },
    { id: 'memory', name: 'Memory', icon: '💾', description: 'Optimize RAM usage and performance', premium: true },
    { id: 'debloater', name: 'Debloater', icon: '🗑️', description: 'Remove Windows bloatware', premium: true },
    { id: 'cleanup', name: 'Cleanup', icon: '🧹', description: 'Free up disk space', premium: false },
    { id: 'startup', name: 'Startup', icon: '▶️', description: 'Manage startup programs', premium: false },
]

export const tweaks: Tweak[] = [
    // FPS
    { id: 'game_dvr', name: 'Game DVR', title: 'Disable Game DVR', description: 'Disables background recording for better FPS', category: 'fps', premium: false },
    { id: 'fso', name: 'FSO', title: 'Disable Fullscreen Optimizations', description: 'Prevents Windows from interfering with games', category: 'fps', premium: false },
    { id: 'game_mode', name: 'Game Mode', title: 'Enable Game Mode', description: 'Optimizes system resources for gaming', category: 'fps', premium: false },
    { id: 'hpet', name: 'HPET', title: 'Disable HPET', description: 'Disables High Precision Event Timer for lower latency', category: 'fps', premium: true },
    { id: 'core_parking', name: 'Core Parking', title: 'Disable Core Parking', description: 'Keeps all CPU cores active', category: 'fps', premium: true },
    { id: 'timer_res', name: 'Timer Resolution', title: 'Set Timer Resolution 0.5ms', description: 'Reduces system timer interval', category: 'fps', premium: true },
    { id: 'gpu_priority', name: 'GPU Priority', title: 'High GPU Priority', description: 'Gives games higher GPU scheduling priority', category: 'fps', premium: true },
    { id: 'cpu_priority', name: 'CPU Priority', title: 'High CPU Priority', description: 'Gives games higher CPU scheduling priority', category: 'fps', premium: true },
    // INPUT
    { id: 'mouse_accel', name: 'Mouse Accel', title: 'Disable Mouse Acceleration', description: 'Raw mouse input for better aim', category: 'input', premium: false },
    { id: 'keyboard_delay', name: 'Key Delay', title: 'Minimum Keyboard Delay', description: 'Fastest initial key repeat delay', category: 'input', premium: false },
    { id: 'keyboard_speed', name: 'Key Speed', title: 'Maximum Keyboard Speed', description: 'Fastest key repeat rate', category: 'input', premium: false },
    { id: 'usb_selective', name: 'USB Suspend', title: 'Disable USB Selective Suspend', description: 'Prevents USB power saving delays', category: 'input', premium: true },
    { id: 'raw_input', name: 'Raw Input', title: 'Enable Raw Input', description: 'DirectInput improvements for games', category: 'input', premium: true },
    { id: 'dpc_latency', name: 'DPC Latency', title: 'Optimize DPC Latency', description: 'Reduces deferred procedure call delays', category: 'input', premium: true },
    // NETWORK
    { id: 'nagle', name: 'Nagle', title: 'Disable Nagle Algorithm', description: 'Sends packets immediately', category: 'network', premium: false },
    { id: 'tcp_nodelay', name: 'TCP NoDelay', title: 'Enable TCP NoDelay', description: 'Disables TCP delay', category: 'network', premium: false },
    { id: 'network_throttle', name: 'Throttle', title: 'Disable Network Throttling', description: 'Removes Windows bandwidth limits', category: 'network', premium: true },
    { id: 'auto_tuning', name: 'Auto-Tuning', title: 'Disable TCP Auto-Tuning', description: 'Prevents Windows from adjusting TCP', category: 'network', premium: true },
    // GPU
    { id: 'hw_accel', name: 'HAGS', title: 'Hardware Accelerated GPU Scheduling', description: 'Reduces latency', category: 'gpu', premium: true },
    { id: 'preemption', name: 'Preemption', title: 'Disable GPU Preemption', description: 'Prevents GPU task interruption', category: 'gpu', premium: true },
    { id: 'mpo', name: 'MPO', title: 'Disable Multiplane Overlay', description: 'Fixes stuttering issues', category: 'gpu', premium: true },
    { id: 'nvidia_telemetry', name: 'NV Telemetry', title: 'Disable NVIDIA Telemetry', description: 'Stops NVIDIA data collection', category: 'gpu', premium: true },
    // MEMORY
    { id: 'superfetch', name: 'Superfetch', title: 'Disable Superfetch/SysMain', description: 'Stops Windows preloading', category: 'memory', premium: true },
    { id: 'prefetch', name: 'Prefetch', title: 'Disable Prefetch', description: 'Disables application prefetching', category: 'memory', premium: true },
    { id: 'memory_compression', name: 'Compression', title: 'Disable Memory Compression', description: 'Reduces CPU usage', category: 'memory', premium: true },
]

export const stats = {
    totalTweaks: tweaks.length,
    freeTweaks: tweaks.filter(t => !t.premium).length,
    premiumTweaks: tweaks.filter(t => t.premium).length,
    categories: categories.length,
}

export const getTweaksByCategory = (categoryId: string) => tweaks.filter(t => t.category === categoryId)
