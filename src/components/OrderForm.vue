  <script>
  export default {
    props: {
      productName: String,
    },
    data() {
      return {
        name: '',
        phone: '',
        address: '',
        product: this.productName,
        quantity: 1,
      };
    },
    methods: {
      submitOrder() {
        const order = {
          name: this.name,
          phone: this.phone,
          address: this.address,
          product: this.product,
          quantity: this.quantity,
        };
        this.$emit('submit-order', order);
      },
    },
  };
  </script>