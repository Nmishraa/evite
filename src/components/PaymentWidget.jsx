import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle2, DollarSign } from 'lucide-react';
import './PaymentWidget.css';

const PaymentWidget = ({ title = "Contribute to Fund", description = "Enter an amount to send", paymentLinks = {} }) => {
  const [amount, setAmount] = useState("50");
  const [method, setMethod] = useState('card');
  const [status, setStatus] = useState('idle'); // idle, processing, success

  const handlePay = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;
    
    if (method === 'venmo' && paymentLinks.venmo) {
      window.open(`https://venmo.com/${paymentLinks.venmo.replace('@', '')}`, '_blank');
      return;
    } else if (method === 'paypal' && paymentLinks.paypal) {
      const link = paymentLinks.paypal.includes('http') ? paymentLinks.paypal : `https://${paymentLinks.paypal}`;
      window.open(link, '_blank');
      return;
    } else if (method === 'cashapp' && paymentLinks.cashapp) {
      window.open(`https://cash.app/${paymentLinks.cashapp}`, '_blank');
      return;
    }

    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div className="payment-widget animate-fade-in">
        <div className="payment-success">
          <div className="success-icon animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h3>Payment Successful!</h3>
          <p>Thank you for your contribution of ${amount}.</p>
          <button className="btn btn-outline" onClick={() => setStatus('idle')}>
            Send Another Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-widget">
      <div className="payment-widget-header">
        <DollarSign className="text-secondary" />
        <div>
          <h3>{title}</h3>
          <p className="text-muted">{description}</p>
        </div>
      </div>

      <form onSubmit={handlePay} className="payment-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="payment-amount">
          <label>Amount</label>
          <div className="amount-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              className="amount-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              required
              disabled={status === 'processing'}
            />
          </div>
        </div>

        <div className="payment-methods">
          <button 
            type="button" 
            className={`payment-method-btn ${method === 'card' ? 'selected' : ''}`}
            onClick={() => setMethod('card')}
          >
            <CreditCard size={24} />
            <span>Card</span>
          </button>
          <button 
            type="button" 
            className={`payment-method-btn ${method === 'venmo' ? 'selected' : ''}`}
            onClick={() => setMethod('venmo')}
          >
            <Smartphone size={24} />
            <span>Venmo</span>
          </button>
          <button 
            type="button" 
            className={`payment-method-btn ${method === 'paypal' ? 'selected' : ''}`}
            onClick={() => setMethod('paypal')}
          >
            <Smartphone size={24} />
            <span>PayPal</span>
          </button>
          <button 
            type="button" 
            className={`payment-method-btn ${method === 'cashapp' ? 'selected' : ''}`}
            onClick={() => setMethod('cashapp')}
          >
            <Smartphone size={24} />
            <span>CashApp</span>
          </button>
        </div>

        {method === 'card' && (
          <div className="cc-form">
            <input type="text" className="cc-input" placeholder="Card Number" required />
            <div className="cc-input-row">
              <input type="text" className="cc-input" placeholder="MM/YY" required />
              <input type="text" className="cc-input" placeholder="CVC" required />
            </div>
          </div>
        )}

        {method === 'venmo' && (
          <div className="external-payment-info" style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {paymentLinks.venmo ? (
              <p>You'll be redirected to Venmo to pay <strong>{paymentLinks.venmo}</strong> securely.</p>
            ) : (
              <p className="text-warning">The host hasn't set up Venmo yet.</p>
            )}
          </div>
        )}

        {method === 'paypal' && (
          <div className="external-payment-info" style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {paymentLinks.paypal ? (
              <p>You'll be redirected to PayPal to pay securely.</p>
            ) : (
              <p className="text-warning">The host hasn't set up PayPal yet.</p>
            )}
          </div>
        )}

        {method === 'cashapp' && (
          <div className="external-payment-info" style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            {paymentLinks.cashapp ? (
              <p>You'll be redirected to CashApp to pay securely.</p>
            ) : (
              <p className="text-warning">The host hasn't set up CashApp yet.</p>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={status === 'processing' || !amount}
          style={{ marginTop: '12px', width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {status === 'processing' ? 'Processing...' : `Pay $${amount || '0'}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentWidget;
