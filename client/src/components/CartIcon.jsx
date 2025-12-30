// src/components/CartIcon.jsx
import { Badge, Button } from "antd";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const CartIcon = () => {
  const { count, setOpen } = useCart();

  return (
    <Badge count={count} showZero>
      <Button
        shape="circle"
        onClick={() => setOpen(true)}
      >
        <ShoppingCart size={18} />
      </Button>
    </Badge>
  );
};

export default CartIcon;
