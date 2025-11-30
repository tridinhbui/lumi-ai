/**
 * Browser notifications utility
 */

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  onClick?: () => void;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Check if notifications are supported and permitted
 */
export function canSendNotifications(): boolean {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

/**
 * Send a browser notification
 */
export async function sendNotification(options: NotificationOptions): Promise<Notification | null> {
  if (!canSendNotifications()) {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn('Notification permission denied');
      return null;
    }
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.ico',
      badge: options.badge || '/favicon.ico',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
      silent: options.silent || false,
    });

    if (options.onClick) {
      notification.onclick = () => {
        window.focus();
        options.onClick?.();
        notification.close();
      };
    }

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
}

/**
 * Send notification for new message
 */
export async function notifyNewMessage(
  senderName: string,
  messagePreview: string,
  onClick?: () => void
): Promise<Notification | null> {
  return sendNotification({
    title: `New message from ${senderName}`,
    body: messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview,
    tag: 'new-message',
    icon: '/favicon.ico',
    onClick,
  });
}

/**
 * Send notification for case completion
 */
export async function notifyCaseCompletion(
  caseName: string,
  onClick?: () => void
): Promise<Notification | null> {
  return sendNotification({
    title: 'Case Completed! 🎉',
    body: `You've successfully completed: ${caseName}`,
    tag: 'case-completed',
    icon: '/favicon.ico',
    onClick,
  });
}

