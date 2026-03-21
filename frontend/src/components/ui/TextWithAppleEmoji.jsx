import React from 'react';
import AppleEmoji from './AppleEmoji';

/** نص مع إيموجي آيفون - يحوّل الإيموجي في النص لصور */
const TextWithAppleEmoji = ({ text, emojiSize = 18 }) => {
  if (!text) return null;
  const emojiRegex = /([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+)/gu;
  const isEmoji = (s) => s && /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]+$/u.test(s);
  const parts = text.split(emojiRegex);
  return parts.map((part, i) =>
    isEmoji(part) ? (
      <AppleEmoji key={i} emoji={part} size={emojiSize} className="inline align-middle mx-0.5" />
    ) : (
      part
    )
  );
};

export default TextWithAppleEmoji;