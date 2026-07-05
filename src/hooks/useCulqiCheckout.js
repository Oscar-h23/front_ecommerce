import { useEffect } from "react";
import axiosClient from "../api/axiosClient";
import useAuthStore from "../store/authStore";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function useCulqiCheckout() {
  const { user, isAuthenticated } = useAuthStore();
  const { cartTotal, items, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Clave para configurar culqi
    if (window.Culqi) {
      window.Culqi.publicKey = "pk_test_dummy_key_replace_me";
      window.Culqi.options({
        lang: "es",
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: false,
          bancaMovil: false,
          agente: false,
          cuotealo: false,
        },
      });
    }

    // Funcion global que Culqi llamara al generar el token
    window.culqi = async function () {
      if (window.Culqi.token) {
        const token = window.Culqi.token.id;
        toast.info("Procesando pago...");
        
        try {
          // 1. Crear el pedido
          const orderPayload = {
            usuario: { id: user.id },
            direccion: null, // Para presentacion solo sera demo
            subtotal: cartTotal,
            total: cartTotal,
            detalles: items.map(item => ({
              producto: { id: item.product.id },
              cantidad: item.quantity,
              precioUnitario: item.product.precio,
              subtotal: item.product.precio * item.quantity
            }))
          };
          
          const orderRes = await axiosClient.post("/pedidos", orderPayload);
          const orderId = orderRes.data.id;

          // 2. Enviar el token de Culqi a nuestro backend para hacer el cargo
          await axiosClient.post("/pagos/procesar", {
            token: token,
            amount: cartTotal,
            email: window.Culqi.token.email,
            orderId: orderId
          });

          toast.success("Pago exitoso. Gracias por tu compra!");
          clearCart();
          navigate("/dashboard");
          window.Culqi.close();
        } catch (err) {
          toast.error(err.response?.data?.error || "Error al procesar el pago");
        }
      } else if (window.Culqi.order) {
        toast.error("Error: " + window.Culqi.error);
      }
    };
  }, [user, cartTotal, items, clearCart, navigate]);

  const openCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesion para comprar");
      navigate("/login");
      return;
    }

    if (!window.Culqi) {
      toast.error("Error cargando pasarela de pago");
      return;
    }

    // Forzamos el bypass de prueba porque no hay llave real (pruebas)
    const USE_SIMULATOR = true;
    if (USE_SIMULATOR) {
      toast.info("Bypass de Prueba: Simulando pasarela");
      setTimeout(() => {
        window.Culqi.token = { id: "tok_test_simulated_123", email: user.email };
        window.culqi();
      }, 1500);
      return;
    }

    window.Culqi.settings({
      title: "Servitek Technologies",
      currency: "PEN",
      amount: Math.round(cartTotal * 100), // Culqi usa centimos
    });
    
    window.Culqi.open();
  };

  return { openCheckout };
}
