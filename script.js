class BreathingTool {
    constructor() {
        this.timeInput = document.getElementById('timeInput');
        this.startRadiusInput = document.getElementById('startRadius');
        this.endRadiusInput = document.getElementById('endRadius');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.breathingCircle = document.getElementById('breathingCircle');
        this.startCircle = document.querySelector('.start-circle');
        this.endCircle = document.querySelector('.end-circle');
        this.instruction = document.getElementById('instruction');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.status = document.getElementById('status');
        this.cycleCount = document.getElementById('cycleCount');
        
        this.cycleTime = 0;
        this.isRunning = false;
        this.animationId = null;
        this.cycles = 0;
        
        this.initEventListeners();
        this.updateCircleSizes();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startBreathing());
        this.stopBtn.addEventListener('click', () => this.stopBreathing());
        this.resetBtn.addEventListener('click', () => this.resetBreathing());
        
        // Update circle sizes when inputs change
        this.startRadiusInput.addEventListener('input', () => this.updateCircleSizes());
        this.endRadiusInput.addEventListener('input', () => this.updateCircleSizes());
        
        // Allow Enter key to start
        this.timeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.startBreathing();
            }
        });
    }
    
    updateCircleSizes() {
        const startRadius = parseInt(this.startRadiusInput.value) || 40;
        const endRadius = parseInt(this.endRadiusInput.value) || 120;
        
        // Update start circumference (diameter = radius * 2)
        this.startCircle.style.width = `${startRadius * 2}px`;
        this.startCircle.style.height = `${startRadius * 2}px`;
        
        // Update end circumference (diameter = radius * 2)
        this.endCircle.style.width = `${endRadius * 2}px`;
        this.endCircle.style.height = `${endRadius * 2}px`;
        
        // Update breathing circle to start position if not running
        if (!this.isRunning) {
            this.breathingCircle.style.width = `${startRadius * 2}px`;
            this.breathingCircle.style.height = `${startRadius * 2}px`;
            this.breathingCircle.style.background = '#4CAF50';
        }
    }
    
    startBreathing() {
        const inputTime = parseFloat(this.timeInput.value);
        const startRadius = parseInt(this.startRadiusInput.value);
        const endRadius = parseInt(this.endRadiusInput.value);
        
        if (!inputTime || inputTime < 0.5) {
            alert('Please enter a valid time (minimum 0.5 seconds)');
            return;
        }
        
        if (startRadius >= endRadius) {
            alert('Start radius must be smaller than end radius');
            return;
        }
        
        if (this.isRunning) return;
        
        this.cycleTime = inputTime;
        this.isRunning = true;
        
        this.updateButtons();
        this.startBreathingAnimation();
    }
    
    stopBreathing() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        
        this.updateButtons();
        this.updateStatus('', 'Breathing stopped');
        this.instruction.textContent = 'Paused';
    }
    
    resetBreathing() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
        
        this.cycles = 0;
        this.cycleCount.textContent = '0';
        this.updateCircleSizes();
        
        this.updateButtons();
        this.updateStatus('', 'Ready to begin breathing exercise');
        this.instruction.textContent = 'Ready';
        this.timeDisplay.textContent = `${this.timeInput.value || 5}s`;
    }
    
    startBreathingAnimation() {
        const startTime = performance.now();
        const halfCycleTime = this.cycleTime * 500; // Convert to milliseconds for half cycle
        const startRadius = parseInt(this.startRadiusInput.value);
        const endRadius = parseInt(this.endRadiusInput.value);
        
        const animate = (currentTime) => {
            if (!this.isRunning) return;
            
            const elapsed = currentTime - startTime;
            const progress = (elapsed % (halfCycleTime * 2)) / halfCycleTime;
            
            // Determine if we're breathing in or out
            const isBreathingIn = progress < 1;
            const phaseProgress = isBreathingIn ? progress : 2 - progress;
            
            // Linear animation between start and end radius
            const currentRadius = startRadius + (endRadius - startRadius) * phaseProgress;
            const currentSize = currentRadius * 2;
            
            // Update breathing circle size
            this.breathingCircle.style.width = `${currentSize}px`;
            this.breathingCircle.style.height = `${currentSize}px`;
            
            // Update color: Green when growing, Red when shrinking
            if (isBreathingIn) {
                this.breathingCircle.style.background = '#4CAF50';
                this.breathingCircle.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
                this.instruction.textContent = 'Breathe IN';
                this.updateStatus('breathing-in', 'Breathing in...');
            } else {
                this.breathingCircle.style.background = '#f44336';
                this.breathingCircle.style.boxShadow = '0 0 20px rgba(244, 67, 54, 0.5)';
                this.instruction.textContent = 'Breathe OUT';
                this.updateStatus('breathing-out', 'Breathing out...');
            }
            
            // Update time display (countdown for current half cycle)
            const timeLeftInHalfCycle = halfCycleTime - (elapsed % halfCycleTime);
            this.timeDisplay.textContent = `${(timeLeftInHalfCycle / 1000).toFixed(1)}s`;
            
            // Count complete cycles
            const currentCycle = Math.floor(elapsed / (halfCycleTime * 2)) + 1;
            if (currentCycle > this.cycles) {
                this.cycles = currentCycle;
                this.cycleCount.textContent = this.cycles;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
    }
    
    updateButtons() {
        this.startBtn.disabled = this.isRunning;
        this.stopBtn.disabled = !this.isRunning;
        
        // Disable radius inputs when running
        this.startRadiusInput.disabled = this.isRunning;
        this.endRadiusInput.disabled = this.isRunning;
    }
    
    updateStatus(className, message) {
        this.status.className = 'status';
        if (className) {
            this.status.classList.add(className);
        }
        this.status.textContent = message;
    }
}

// Initialize the breathing tool when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BreathingTool();
});