import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import useCart from "../../hooks/useCart";

const stripePromise = loadStripe(import.meta.env.VITE_Stripe_PK);

const ProcessCheckout = () => {
  const [cart, refetch] = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectedItems = JSON.parse(params.get("selectedItems") || "{}");

  const filteredCart = cart.filter((item) => selectedItems[item._id]);

  const cartTotals = filteredCart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  useEffect(() => {
    if (filteredCart.length === 0) {
      navigate("/cart-pay");
    }
  }, [filteredCart, navigate]);

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 pb-16 my-4 sm:my-10 px-4">
      <div className="py-24">
        <Elements stripe={stripePromise}>
          <CheckoutForm cart={filteredCart} cartTotals={cartTotals} />
        </Elements>
      </div>
    </div>
  );
};

export default ProcessCheckout;
