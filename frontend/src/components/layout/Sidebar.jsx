import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretDown, CaretUp, TelegramLogo } from '@phosphor-icons/react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [orderMenuOpen, setOrderMenuOpen] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { title: 'الرئيسية', action: () => handleNavigate('/') },
    {
      title: 'اطلب الآن',
      isDropdown: true,
      isOpen: orderMenuOpen,
      toggle: () => setOrderMenuOpen(!orderMenuOpen),
      subItems: [
        { title: 'سادس الابتدائي', action: () => handleNavigate('/subject?grade=السادس ابتدائي') },
        { title: 'الثالث متوسط', action: () => handleNavigate('/subject?grade=الثالث متوسط') },
        { title: 'السادس الإعدادي العلمي', action: () => handleNavigate('/subject?grade=السادس إعدادي - العلمي') },
        { title: 'السادس الإعدادي الأدبي', action: () => handleNavigate('/subject?grade=السادس إعدادي - الأدبي') },
      ]
    },
    {
      title: 'تواصل معنا',
      isDropdown: true,
      isOpen: contactMenuOpen,
      toggle: () => setContactMenuOpen(!contactMenuOpen),
      subItems: [
        { title: 'تواصل مع الاستاذ كرار', icon: <TelegramLogo weight="fill" className="text-blue-400 inline ml-2" />, link: 'https://t.me/kahrkm' },
        { title: 'القناة الرسمية للتلكرام', icon: <TelegramLogo weight="fill" className="text-blue-400 inline ml-2" />, link: 'https://t.me/SS_5XN' },
      ]
    },
    { title: 'طلباتي', action: () => handleNavigate('/orders') },
    { title: 'الأسئلة الشائعة (FAQ)', action: () => { navigate('/', { state: { scrollTo: 'faq' } }); onClose(); } },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-72 glass-card border-l border-black/10 dark:border-white/10 z-[70] p-6 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8 border-b border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-bold font-head text-gray-900 dark:text-white">القائمة الرئيسية</h2>
              <button onClick={onClose} className="p-2 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition">
                <X weight="bold" className="text-xl" />
              </button>
            </div>

            <ul className="space-y-2 font-bold text-gray-700 dark:text-gray-300">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.isDropdown ? (
                    <div>
                      <button onClick={item.toggle} className="w-full text-right hover:text-primary transition flex justify-between items-center py-3 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                        <span>{item.title}</span>
                        {item.isOpen ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
                      </button>
                      <AnimatePresence>
                        {item.isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="bg-black/5 dark:bg-white/5 rounded-lg mt-1 overflow-hidden"
                          >
                            {item.subItems.map((sub, idx) => (
                              <li key={idx}>
                                {sub.link ? (
                                  <a href={sub.link} target="_blank" rel="noreferrer" className="block py-2 px-4 hover:bg-primary/20 hover:text-primary transition text-sm">
                                    {sub.icon} {sub.title}
                                  </a>
                                ) : (
                                  <button onClick={sub.action} className="w-full text-right py-2 px-4 hover:bg-primary/20 hover:text-primary transition text-sm">
                                    {sub.title}
                                  </button>
                                )}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button onClick={item.action} className="w-full text-right py-3 px-2 hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary transition rounded-lg">
                      {item.title}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;