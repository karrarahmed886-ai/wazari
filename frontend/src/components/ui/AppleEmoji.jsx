import React from 'react';

/** إيموجي بنمط آيفون - يستخدم EmojiCDN (emojicdn.elk.sh) */
const AppleEmoji = ({ emoji, size = 24, className = '' }) => (
  <img
    src={`https://emojicdn.elk.sh/${encodeURIComponent(emoji)}`}
    alt=""
    width={size}
    height={size}
    className={`inline-block align-middle ${className}`}
    loading="lazy"
  />
);

export default AppleEmoji;