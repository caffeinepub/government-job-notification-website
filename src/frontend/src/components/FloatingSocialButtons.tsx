import { useState } from 'react';
import { SiWhatsapp, SiTelegram } from 'react-icons/si';
import { MessageCircle } from 'lucide-react';
import { AiChatModal } from './AiChatModal';

export function FloatingSocialButtons() {
  const [showAiChat, setShowAiChat] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3">
        {/* WhatsApp Button */}
        <a
          href="https://chat.whatsapp.com/KWpGOqZjxClDo6RKAqRrVd?mode=gi_t"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-social-btn whatsapp-btn"
          aria-label="Join WhatsApp Group"
        >
          <SiWhatsapp className="w-6 h-6" />
        </a>

        {/* Telegram Button */}
        <a
          href="https://t.me/+-Os-RQ26AWY1ZGFl"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-social-btn telegram-btn"
          aria-label="Join Telegram Channel"
        >
          <SiTelegram className="w-6 h-6" />
        </a>

        {/* AI Chat Button */}
        <button
          onClick={() => setShowAiChat(true)}
          className="floating-social-btn ai-chat-btn"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      <AiChatModal open={showAiChat} onOpenChange={setShowAiChat} />
    </>
  );
}
