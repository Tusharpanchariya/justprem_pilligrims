import { useEffect, useState, type FormEvent } from 'react';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { countries } from '@/lib/countries';
import { ChevronDown } from 'lucide-react';

type PaymentMethod = 'paypal' | 'wise';

interface EnquiryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EnquiryModal({ open, onClose }: EnquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+44');
  const [country, setCountry] = useState('United Kingdom');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'paypal-checkout' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDialCode('+44');
    setCountry('United Kingdom');
    setPaymentMethod('paypal');
    setStatus('idle');
    setErrorMsg('');
  };

  const handleClose = () => {
    if (status === 'success') resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!name.trim() || !email.trim() || !phone.trim() || !country.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('Retreat_enquiries').insert({
      name: name.trim(),
      email: email.trim(),
      phone: `${dialCode} ${phone.trim()}`,
      country: country.trim(),
      payment_method: paymentMethod,
    });

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }

    if (paymentMethod === 'paypal') {
      setStatus('paypal-checkout');
    } else {
      setStatus('success');
      // Send the email for Wise via Edge Function
      supabase.functions.invoke('send-Retreat-email', {
        body: {
          name: name.trim(),
          email: email.trim(),
          phone: `${dialCode} ${phone.trim()}`,
          country: country.trim(),
          paymentMethod: 'wise'
        }
      }).catch(console.error);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-near-black/80 backdrop-blur-sm p-4 md:p-6"
      onClick={handleClose}
    >
      <div
        className="relative my-auto w-full max-w-lg border border-[#E6DCC8]/20 bg-gradient-to-b from-[#101012] to-near-black p-8 md:p-12 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner accents */}
        <div className="absolute left-0 top-0 h-8 w-8 border-l border-t border-[#E6DCC8]/30" />
        <div className="absolute right-0 top-0 h-8 w-8 border-r border-t border-[#E6DCC8]/30" />
        <div className="absolute bottom-0 left-0 h-8 w-8 border-b border-l border-[#E6DCC8]/30" />
        <div className="absolute bottom-0 right-0 h-8 w-8 border-b border-r border-[#E6DCC8]/30" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 text-[#EBE7DE]/50 transition-colors hover:text-[#F1EEE7]"
          aria-label="Close form"
        >
          <X size={20} strokeWidth={1} />
        </button>

        {status === 'paypal-checkout' ? (
          <div className="py-6 text-center">
            <h3 className="mb-4 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
              Complete Your Payment
            </h3>
            <p className="mb-10 font-sans text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
              Your details have been saved securely. Please complete the &euro;1,900 Early Bird payment to reserve your spot.
            </p>

            <div className="relative z-50 min-h-[150px]">
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "EUR" }}>
                <PayPalButtons
                  style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "EUR",
                            value: "1900.00",
                          },
                          description: "11 Nights / 12 Days Retreat (Early Bird)",
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    if (actions.order) {
                      return actions.order.capture().then(() => {
                        setStatus('success');
                        // Send the email for PayPal via Edge Function
                        supabase.functions.invoke('send-Retreat-email', {
                          body: {
                            name: name.trim(),
                            email: email.trim(),
                            phone: `${dialCode} ${phone.trim()}`,
                            country: country.trim(),
                            paymentMethod: 'paypal'
                          }
                        }).catch(console.error);
                      });
                    }
                    return Promise.resolve();
                  }}
                />
              </PayPalScriptProvider>
            </div>

            <button
              onClick={handleClose}
              className="mt-8 font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#EBE7DE]/60 transition-colors hover:text-[#F1EEE7]"
            >
              Cancel Payment
            </button>
          </div>
        ) : status === 'success' ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#E6DCC8]/30">
              <Check size={24} strokeWidth={1} className="text-[#E6DCC8]" />
            </div>

            {paymentMethod === 'wise' ? (
              <>
                <h3 className="mb-4 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
                  Enquiry Received
                </h3>
                <p className="mb-8 font-sans text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
                  Thank you, {name.split(' ')[0] || 'traveler'}. Your spot is held. Please complete your transfer to finalize your booking.
                </p>

                <div className="mt-8 text-left border border-[#E6DCC8]/20 bg-[#141416] p-6 shadow-inner">
                  <h4 className="font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/80 mb-5">Wise Transfer Details</h4>

                  <div className="space-y-4 font-sans text-[13px] font-light text-[#F1EEE7]">
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">Account Name</span>
                      <span className="font-medium text-right">vitthal prem travels llp</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">IBAN</span>
                      <span className="font-medium text-right">BE75 9059 5938 2951</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#E6DCC8]/10 pb-3">
                      <span className="text-[#EBE7DE]/50">Swift/BIC</span>
                      <span className="font-medium text-right">TRWIBEB1XXX</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-[#EBE7DE]/50">Amount</span>
                      <span className="font-medium text-right">&euro;1,900</span>
                    </div>
                  </div>

                  <p className="mt-5 font-sans text-[10px] text-[#EBE7DE]/40 leading-[1.6] text-center border-t border-[#E6DCC8]/10 pt-4">
                    Important: Please use "{name || 'Your Full Name'}" as the transfer reference so we can match your payment.
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-4 font-serif text-3xl font-medium tracking-[-0.02em] text-[#F1EEE7]">
                  Payment Successful
                </h3>
                <p className="mb-4 font-sans text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
                  Thank you, {name.split(' ')[0] || 'traveler'}. Your Retreat is officially booked! We will contact you shortly with preparation details.
                </p>
              </>
            )}

            <button
              onClick={handleClose}
              className="mt-10 font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#EBE7DE]/60 transition-colors hover:text-[#F1EEE7]"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <p className="mb-4 font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.28em] text-[#E6DCC8]/75">
              Begin Your Retreat
            </p>
            <h3 className="mb-4 font-serif text-3xl md:text-4xl font-medium tracking-[-0.025em] text-[#F1EEE7]">
              Enquire for the Retreat
            </h3>
            <p className="mb-10 font-sans text-[13px] md:text-[14px] font-light leading-[1.6] text-[#EBE7DE]/70">
              Share your details and we will guide you through the next steps of
              Heart of the Himalayas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="enq-name"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Full Name
                </label>
                <input
                  id="enq-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none transition-colors focus:border-[#E6DCC8]/60"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="enq-email"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Email
                </label>
                <input
                  id="enq-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-[#E6DCC8]/20 bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none transition-colors focus:border-[#E6DCC8]/60"
                  placeholder="you@email.com"
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="enq-phone"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Phone Number
                </label>
                <div className="flex items-end gap-3">
                  <div className="relative w-[100px] border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="w-full appearance-none bg-transparent py-3 pl-2 pr-6 font-sans text-[14px] font-light text-[#F1EEE7] outline-none cursor-pointer"
                    >
                      {countries.map((c) => (
                        <option key={c.code} value={c.dialCode} className="bg-[#101012] text-[#F1EEE7]">
                          {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DCC8]/60" />
                  </div>
                  <div className="flex-1 border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                    <input
                      id="enq-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent py-3 font-sans text-[14px] font-light text-[#F1EEE7] placeholder-[#EBE7DE]/30 outline-none"
                      placeholder="123 456 7890"
                      autoComplete="tel-national"
                    />
                  </div>
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="enq-country"
                  className="mb-2 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60"
                >
                  Country
                </label>
                <div className="relative border-b border-[#E6DCC8]/20 transition-colors focus-within:border-[#E6DCC8]/60">
                  <select
                    id="enq-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none bg-transparent py-3 pl-2 pr-10 font-sans text-[14px] font-light text-[#F1EEE7] outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#101012] text-[#EBE7DE]/30">Select your country</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name} className="bg-[#101012] text-[#F1EEE7]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#E6DCC8]/60" />
                </div>
              </div>

              {/* Payment method */}
              <div className="pt-2">
                <label className="mb-4 block font-sans text-[10px] uppercase font-medium tracking-[0.2em] text-[#E6DCC8]/60">
                  Preferred Payment Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center justify-center border h-[52px] transition-colors duration-500 ${paymentMethod === 'paypal'
                        ? 'border-[#E6DCC8]/40 bg-[#E6DCC8]/10 text-[#F1EEE7]'
                        : 'border-[#E6DCC8]/15 bg-transparent text-[#EBE7DE]/50 hover:bg-white/5 hover:text-[#EBE7DE]/80'
                      }`}
                  >
                    <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase">
                      PayPal
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wise')}
                    className={`flex items-center justify-center border h-[52px] transition-colors duration-500 ${paymentMethod === 'wise'
                        ? 'border-[#E6DCC8]/40 bg-[#E6DCC8]/10 text-[#F1EEE7]'
                        : 'border-[#E6DCC8]/15 bg-transparent text-[#EBE7DE]/50 hover:bg-white/5 hover:text-[#EBE7DE]/80'
                      }`}
                  >
                    <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase">
                      Wise
                    </span>
                  </button>
                </div>
              </div>

              {/* Error */}
              {status === 'error' && (
                <p className="pt-2 text-[12px] font-light text-red-400">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="group mt-6 flex h-[56px] w-full items-center justify-center gap-3 border border-[#E6DCC8]/30 bg-transparent transition-colors duration-700 hover:border-[#E6DCC8]/60 disabled:opacity-50"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} strokeWidth={1.2} className="animate-spin text-[#F1EEE7]" />
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7]">
                      Submitting
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-sans text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-[#F1EEE7] transition-colors duration-700 group-hover:text-white">
                      Apply for the Retreat
                    </span>
                    <ArrowRight
                      size={14}
                      strokeWidth={1}
                      className="text-[#E6DCC8]/70 transition-transform duration-700 group-hover:translate-x-1 group-hover:text-white"
                    />
                  </>
                )}
              </button>

              <p className="pt-4 text-center font-sans text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-[#EBE7DE]/40">
                {paymentMethod === 'paypal'
                  ? 'Complete your payment instantly via PayPal after applying'
                  : 'You will receive Wise bank details upon applying'}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
