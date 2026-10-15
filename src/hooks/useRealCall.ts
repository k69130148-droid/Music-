import { useCallback } from 'react';
import { phoneStorage } from '../utils/phoneStorage';
import { audioToneService } from '../services/audioTones';

export function useRealCall() {
  /**
   * Format Palestinian number to clean standard
   */
  const formatPalestinianNumber = useCallback((number: string): string => {
    let clean = number.trim().replace(/[^\d+*#]/g, '');
    return clean;
  }, []);

  /**
   * Initiate a REAL Cellular Phone Call through the device's native SIM
   * (Jawwal Palestine 059 / Ooredoo 056 / Any local/international carrier)
   */
  const makeRealPhoneCall = useCallback((number: string, callerName?: string, simSlot = 'sim1') => {
    if (!number.trim()) return;

    audioToneService.playDialTone(0.4);
    audioToneService.triggerHaptic(60);

    const formatted = formatPalestinianNumber(number);

    // Save real call attempt in Call Logs history
    phoneStorage.addCallLog({
      name: callerName || formatted,
      number: formatted,
      type: 'outgoing',
      timestamp: Date.now(),
      durationSeconds: 1, // Real cellular call opened
      simId: (simSlot as 'sim1' | 'sim2') || 'sim1',
      note: 'مكالمة هاتفية فعلية عبر شريحة الهاتف (SIM Cellular)',
    });

    // Native telephony protocol trigger
    // On iOS Safari / Android Chrome / HarmonyOS, this immediately pops up
    // the system dialer and dials the real phone number over the cellular network.
    window.location.href = `tel:${formatted}`;
  }, [formatPalestinianNumber]);

  /**
   * Open real native SMS messaging
   */
  const sendRealSms = useCallback((number: string) => {
    const formatted = formatPalestinianNumber(number);
    audioToneService.triggerHaptic(30);
    window.location.href = `sms:${formatted}`;
  }, [formatPalestinianNumber]);

  /**
   * Open WhatsApp Voice Call / Chat formatted for Palestine (+970 / +972)
   */
  const openWhatsAppCall = useCallback((number: string) => {
    let clean = number.replace(/\D/g, '');
    if (clean.startsWith('059') || clean.startsWith('056')) {
      clean = '970' + clean.slice(1);
    } else if (clean.startsWith('59') || clean.startsWith('56')) {
      clean = '970' + clean;
    }
    audioToneService.triggerHaptic(30);
    window.open(`https://wa.me/${clean}`, '_blank');
  }, []);

  return {
    makeRealPhoneCall,
    sendRealSms,
    openWhatsAppCall,
    formatPalestinianNumber,
  };
}
