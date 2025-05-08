// export const globalStyles = `
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   @keyframes pulse {
//     0% { transform: scale(1); opacity: 1; }
//     50% { transform: scale(1.05); opacity: 0.8; }
//     100% { transform: scale(1); opacity: 1; }
//   }

//   @keyframes gradientMove {
//     0% { background-position: 0% 50%; }
//     50% { background-position: 100% 50%; }
//     100% { background-position: 0% 50%; }
//   }

//   @keyframes breathe {
//     0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
//     70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
//     100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
//   }

//   @keyframes wave {
//     0%, 100% { transform: translateY(0); }
//     25% { transform: translateY(-5px); }
//     75% { transform: translateY(5px); }
//   }

//   @keyframes float {
//     0% { transform: translateY(0px); }
//     50% { transform: translateY(-10px); }
//     100% { transform: translateY(0px); }
//   }

//   @keyframes glow {
//     0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
//     50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
//     100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
//   }

//   .animate-fadeIn {
//     animation: fadeIn 0.5s ease forwards;
//   }

//   .animate-pulse-subtle {
//     animation: pulse 3s infinite;
//   }

//   .animate-breathe {
//     animation: breathe 2.5s infinite;
//   }

//   .animate-wave {
//     animation: wave 1.5s ease-in-out infinite;
//   }

//   .animate-float {
//     animation: float 6s ease-in-out infinite;
//   }

//   .animate-glow {
//     animation: glow 2s ease-in-out infinite;
//   }

//   .transcript-container {
//     border-radius: 1rem;
//     background-color: white;
//     box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
//     transition: all 0.3s ease;
//     overflow-y: auto;
//     scrollbar-width: thin;
//     scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
//   }

//   .transcript-container::-webkit-scrollbar {
//     width: 6px;
//   }

//   .transcript-container::-webkit-scrollbar-track {
//     background: transparent;
//   }

//   .transcript-container::-webkit-scrollbar-thumb {
//     background-color: rgba(59, 130, 246, 0.5);
//     border-radius: 6px;
//   }

//   .dark .transcript-container {
//     background-color: rgba(17, 24, 39, 0.8);
//   }

//   .message-card {
//     position: relative;
//     transition: all 0.3s ease;
//     animation: fadeIn 0.5s ease forwards;
//     border-radius: 1rem;
//     overflow: hidden;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
//     margin-bottom: 1rem;
//   }

//   .message-header {
//     display: flex;
//     align-items: center;
//     padding: 0.75rem 1rem;
//   }

//   .ai-header {
//     background: linear-gradient(135deg, #3b82f6, #2563eb);
//     color: white;
//   }

//   .user-header {
//     background: linear-gradient(135deg, #10b981, #059669);
//     color: white;
//   }

//   .message-avatar {
//     width: 32px;
//     height: 32px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin-right: 0.75rem;
//     flex-shrink: 0;
//     background: rgba(255, 255, 255, 0.2);
//   }

//   .message-content {
//     padding: 1rem;
//     background: white;
//     color: #1f2937;
//   }

//   .dark .message-content {
//     background: #1f2937;
//     color: #f3f4f6;
//   }

//   .message-time {
//     margin-left: auto;
//     font-size: 0.75rem;
//     opacity: 0.7;
//   }

//   .speaking-now {
//     position: absolute;
//     top: 0.5rem;
//     right: 0.5rem;
//     background: #22c55e;
//     color: white;
//     border-radius: 9999px;
//     padding: 0.25rem 0.5rem;
//     font-size: 0.75rem;
//     font-weight: 500;
//     box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
//     animation: pulse 1.5s infinite;
//     z-index: 10;
//   }

//   .gradient-bg {
//     background: linear-gradient(120deg, #3b82f6, #2563eb, #1d4ed8);
//     background-size: 200% 200%;
//     animation: gradientMove 15s ease infinite;
//   }

//   .glass-card {
//     background: rgba(255, 255, 255, 0.8);
//     backdrop-filter: blur(16px);
//     border: 1px solid rgba(255, 255, 255, 0.2);
//     box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
//   }

//   .dark .glass-card {
//     background: rgba(17, 24, 39, 0.75);
//     border: 1px solid rgba(255, 255, 255, 0.1);
//   }

//   .video-container {
//     transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//     overflow: hidden;
//     border-radius: 1rem;
//     box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
//   }

//   .video-container:hover {
//     transform: scale(1.02);
//     box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.15);
//   }

//   .video-container.ai {
//     background: linear-gradient(135deg, #3b82f6, #2563eb);
//     border: 2px solid rgba(59, 130, 246, 0.3);
//   }

//   .video-container.user {
//     background: linear-gradient(135deg, #059669, #10b981);
//     border: 2px solid rgba(16, 185, 129, 0.3);
//   }

//   .speaking-indicator {
//     display: inline-flex;
//     align-items: center;
//     height: 24px;
//   }

//   .speaking-indicator span {
//     width: 4px;
//     height: 16px;
//     margin: 0 1px;
//     background-color: #4ade80;
//     border-radius: 2px;
//     animation: speaking 0.8s ease infinite;
//   }

//   .speaking-indicator span:nth-child(1) { animation-delay: -0.45s; }
//   .speaking-indicator span:nth-child(2) { animation-delay: -0.3s; }
//   .speaking-indicator span:nth-child(3) { animation-delay: -0.15s; }

//   @keyframes speaking {
//     0%, 100% { transform: scaleY(0.4); }
//     50% { transform: scaleY(1); }
//   }

//   .ai-gradient {
//     background: linear-gradient(to bottom right, #3b82f6, #2563eb);
//   }

//   .ai-indicator {
//     position: absolute;
//     z-index: 10;
//     top: -8px;
//     right: -8px;
//     width: 22px;
//     height: 22px;
//     border-radius: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border: 2px solid white;
//     background: #2563eb;
//     color: white;
//   }

//   .next-question-preview {
//     background: rgba(59, 130, 246, 0.08);
//     border-left: 3px solid #3b82f6;
//     padding: 0.75rem;
//     border-radius: 0.5rem;
//     margin-top: 0.5rem;
//     font-style: italic;
//     transition: all 0.3s ease;
//   }

//   .next-question-preview:hover {
//     background: rgba(59, 130, 246, 0.12);
//   }

//   .speaking-animation {
//     position: relative;
//   }

//   .speaking-animation::after {
//     content: '';
//     position: absolute;
//     bottom: -5px;
//     left: 0;
//     right: 0;
//     height: 2px;
//     background: linear-gradient(90deg, 
//       rgba(59, 130, 246, 0) 0%, 
//       rgba(59, 130, 246, 1) 50%, 
//       rgba(59, 130, 246, 0) 100%);
//     animation: speaking-line 2s infinite;
//   }

//   .interview-timer {
//     display: flex;
//     align-items: center;
//     background: rgba(59, 130, 246, 0.1);
//     padding: 0.5rem 0.75rem;
//     border-radius: 9999px;
//     font-size: 0.875rem;
//     color: #3b82f6;
//     font-weight: 500;
//   }

//   .dark .interview-timer {
//     background: rgba(59, 130, 246, 0.2);
//     color: #93c5fd;
//   }

//   .transcript-toggle-button {
//     position: absolute;
//     bottom: 1rem;
//     right: 1rem;
//     z-index: 10;
//     background: white;
//     border: 1px solid rgba(59, 130, 246, 0.3);
//     border-radius: 9999px;
//     padding: 0.5rem;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//     transition: all 0.2s ease;
//   }

//   .transcript-toggle-button:hover {
//     transform: scale(1.05);
//     box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
//   }

//   .dark .transcript-toggle-button {
//     background: #1f2937;
//     border-color: rgba(59, 130, 246, 0.5);
//   }

//   .transcript-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 0.75rem 1rem;
//     background: #f9fafb;
//     border-bottom: 1px solid #e5e7eb;
//     border-top-left-radius: 1rem;
//     border-top-right-radius: 1rem;
//   }

//   .dark .transcript-header {
//     background: #1f2937;
//     border-bottom: 1px solid #374151;
//   }

//   .transcript-title {
//     font-weight: 600;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     color: #3b82f6;
//   }

//   .dark .transcript-title {
//     color: #93c5fd;
//   }

//   .transcript-body {
//     padding: 1rem;
//     overflow-y: auto;
//   }

//   .live-indicator {
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     font-size: 0.875rem;
//     font-weight: 500;
//     color: #22c55e;
//   }

//   .live-indicator::before {
//     content: '';
//     display: block;
//     width: 8px;
//     height: 8px;
//     border-radius: 50%;
//     background-color: #22c55e;
//     animation: pulse 1.5s infinite;
//   }

//   .question-card {
//     background: rgba(59, 130, 246, 0.05);
//     border-left: 3px solid #3b82f6;
//     padding: 1rem;
//     border-radius: 0.5rem;
//     margin-top: 1rem;
//     transition: all 0.3s ease;
//   }

//   .question-card:hover {
//     background: rgba(59, 130, 246, 0.1);
//   }

//   .question-number {
//     font-weight: 600;
//     color: #3b82f6;
//     margin-bottom: 0.25rem;
//   }

//   .question-text {
//     font-style: italic;
//     color: #4b5563;
//   }

//   .dark .question-text {
//     color: #9ca3af;
//   }

//   .human-avatar {
//     width: 48px;
//     height: 48px;
//     border-radius: 50%;
//     object-fit: cover;
//     border: 2px solid #3b82f6;
//   }

//   .message-transition {
//     position: relative;
//     padding: 0.5rem 1rem;
//     background: rgba(59, 130, 246, 0.05);
//     border-radius: 0.5rem;
//     margin: 1rem 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 0.875rem;
//     color: #6b7280;
//   }

//   .message-transition::before,
//   .message-transition::after {
//     content: '';
//     height: 1px;
//     background: #e5e7eb;
//     flex: 1;
//   }

//   .message-transition::before {
//     margin-right: 0.5rem;
//   }

//   .message-transition::after {
//     margin-left: 0.5rem;
//   }

//   .dark .message-transition::before,
//   .dark .message-transition::after {
//     background: #374151;
//   }

//   .transcript-focus {
//     border: 2px solid transparent;
//     transition: all 0.3s ease;
//   }

//   .transcript-focus:hover {
//     border-color: rgba(59, 130, 246, 0.3);
//   }

//   .transcript-focus.active {
//     border-color: #3b82f6;
//   }

//   .message-arrow {
//     position: absolute;
//     right: 1rem;
//     bottom: -0.75rem;
//     color: #3b82f6;
//     transform: rotate(90deg);
//     opacity: 0.7;
//   }
//   .speaking-indicator span {
//       display: inline-block;
//       width: 4px;
//       height: 4px;
//       margin: 0 1px;
//       background-color: currentColor;
//       border-radius: 50%;
//       animation: bounce 0.8s infinite;
//     }

//     .speaking-indicator span:nth-child(1) {
//       animation-delay: 0s;
//     }

//     .speaking-indicator span:nth-child(2) {
//       animation-delay: 0.2s;
//     }

//     .speaking-indicator span:nth-child(3) {
//       animation-delay: 0.4s;
//     }

//     .pulse-dot {
//       display: inline-block;
//       width: 8px;
//       height: 8px;
//       border-radius: 50%;
//       background-color: currentColor;
//       margin-right: 6px;
//       animation: pulse 1.5s infinite;
//     }
// `


export const globalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .transcript-container {
    border-radius: 1rem;
    background-color: white;
    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
  }

  .transcript-container::-webkit-scrollbar {
    width: 6px;
  }

  .transcript-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .transcript-container::-webkit-scrollbar-thumb {
    background-color: rgba(59, 130, 246, 0.5);
    border-radius: 6px;
  }
  
  .dark .transcript-container {
    background-color: rgba(17, 24, 39, 0.8);
  }
  
  .message-card {
    position: relative;
    transition: all 0.3s ease;
    animation: fadeIn 0.5s ease forwards;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    margin-bottom: 1rem;
  }
  
  .message-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
  }
  
  .ai-header {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
  }
  
  .user-header {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.2);
  }

  .message-content {
    padding: 1rem;
    background: white;
    color: #1f2937;
  }
  
  .dark .message-content {
    background: #1f2937;
    color: #f3f4f6;
  }

  .message-time {
    margin-left: auto;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .speaking-now {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #22c55e;
    color: white;
    border-radius: 9999px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);
    z-index: 10;
  }
  
  .video-container {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    border-radius: 1rem;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
  }
  
  .video-container:hover {
    transform: scale(1.02);
    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.15);
  }

  .video-container.ai {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    border: 2px solid rgba(59, 130, 246, 0.3);
  }

  .video-container.user {
    background: linear-gradient(135deg, #059669, #10b981);
    border: 2px solid rgba(16, 185, 129, 0.3);
  }
  
  .speaking-indicator {
    display: inline-flex;
    align-items: center;
    height: 24px;
  }
  
  .speaking-indicator span {
    width: 4px;
    height: 16px;
    margin: 0 1px;
    background-color: #4ade80;
    border-radius: 2px;
    animation: speaking 0.8s ease infinite;
  }
  
  .speaking-indicator span:nth-child(1) { animation-delay: -0.45s; }
  .speaking-indicator span:nth-child(2) { animation-delay: -0.3s; }
  .speaking-indicator span:nth-child(3) { animation-delay: -0.15s; }
  
  @keyframes speaking {
    0%, 100% { transform: scaleY(0.4); }
    50% { transform: scaleY(1); }
  }
  
  .ai-gradient {
    background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  }
  
  .ai-indicator {
    position: absolute;
    z-index: 10;
    top: -8px;
    right: -8px;
    width: 22px;
    height: 22px;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    background: #2563eb;
    color: white;
  }
  
  .next-question-preview {
    background: rgba(59, 130, 246, 0.08);
    border-left: 3px solid #3b82f6;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    font-style: italic;
    transition: all 0.3s ease;
  }
  
  .next-question-preview:hover {
    background: rgba(59, 130, 246, 0.12);
  }
  
  .speaking-animation {
    position: relative;
  }
  
  .speaking-animation::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      rgba(59, 130, 246, 0) 0%, 
      rgba(59, 130, 246, 1) 50%, 
      rgba(59, 130, 246, 0) 100%);
    animation: speaking-line 2s infinite;
  }

  .interview-timer {
    display: flex;
    align-items: center;
    background: rgba(59, 130, 246, 0.1);
    padding: 0.5rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    color: #3b82f6;
    font-weight: 500;
  }

  .dark .interview-timer {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
  }

  .transcript-toggle-button {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    z-index: 10;
    background: white;
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 9999px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
  }

  .transcript-toggle-button:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }

  .dark .transcript-toggle-button {
    background: #1f2937;
    border-color: rgba(59, 130, 246, 0.5);
  }

  .transcript-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
  }

  .dark .transcript-header {
    background: #1f2937;
    border-bottom: 1px solid #374151;
  }

  .transcript-title {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3b82f6;
  }

  .dark .transcript-title {
    color: #93c5fd;
  }

  .transcript-body {
    padding: 1rem;
    overflow-y: auto;
  }

  .live-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #22c55e;
  }

  .live-indicator::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #22c55e;
    animation: pulse 1.5s infinite;
  }

  .question-card {
    background: rgba(59, 130, 246, 0.05);
    border-left: 3px solid #3b82f6;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .question-card:hover {
    background: rgba(59, 130, 246, 0.1);
  }

  .question-number {
    font-weight: 600;
    color: #3b82f6;
    margin-bottom: 0.25rem;
  }

  .question-text {
    font-style: italic;
    color: #4b5563;
  }

  .dark .question-text {
    color: #9ca3af;
  }

  .human-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #3b82f6;
  }

  .message-transition {
    position: relative;
    padding: 0.5rem 1rem;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 0.5rem;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .message-transition::before,
  .message-transition::after {
    content: '';
    height: 1px;
    background: #e5e7eb;
    flex: 1;
  }

  .message-transition::before {
    margin-right: 0.5rem;
  }

  .message-transition::after {
    margin-left: 0.5rem;
  }

  .dark .message-transition::before,
  .dark .message-transition::after {
    background: #374151;
  }

  .transcript-focus {
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }

  .transcript-focus:hover {
    border-color: rgba(59, 130, 246, 0.3);
  }

  .transcript-focus.active {
    border-color: #3b82f6;
  }

  .message-arrow {
    position: absolute;
    right: 1rem;
    bottom: -0.75rem;
    color: #3b82f6;
    transform: rotate(90deg);
    opacity: 0.7;
  }
  .speaking-indicator span {
      display: inline-block;
      width: 4px;
      height: 4px;
      margin: 0 1px;
      background-color: currentColor;
      border-radius: 50%;
      animation: bounce 0.8s infinite;
    }
    
    .speaking-indicator span:nth-child(1) {
      animation-delay: 0s;
    }
    
    .speaking-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .speaking-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    .pulse-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: currentColor;
      margin-right: 6px;
      animation: pulse 1.5s infinite;
    }
`