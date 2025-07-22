import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  onOpen?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange(newOpen);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const typeName = (child.type as any).displayName || (child.type as any).name;
          if (typeName === 'DialogTrigger') {
            return React.cloneElement(child as any, {
              onOpen: () => handleOpenChange(true)
            });
          }
          if (typeName === 'DialogContent' && isOpen) {
            return React.cloneElement(child as any, {
              onClose: () => handleOpenChange(false)
            });
          }
        }
        return child;
      })}
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps & { onClose?: () => void }> = ({ 
  children, 
  className = "",
  onClose 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      {/* Modal Content */}
      <div className={`relative bg-white rounded-lg shadow-xl ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
);

export const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, onOpen }) => {
  // Attach onClick to the first valid child if possible
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        if ((children as React.ReactElement<any>).props.onClick) (children as React.ReactElement<any>).props.onClick(e);
        if (onOpen) onOpen();
      }
    });
  }
  // Fallback: wrap in a div
  return (
    <div className="cursor-pointer" onClick={onOpen}>
      {children}
    </div>
  );
};
DialogTrigger.displayName = 'DialogTrigger';
DialogContent.displayName = 'DialogContent'; 