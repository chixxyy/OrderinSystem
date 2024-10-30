<template>
  <div>
    <h2>訂購表單</h2>
    <form @submit.prevent="submitOrder">
      <div>
        <label for="name">姓名:</label>
        <input id="name" v-model="name" required />
      </div>
      <div>
        <label for="phone">聯絡電話:</label>
        <input id="phone" v-model="phone" required />
      </div>
      <div>
        <label for="address">地址:</label>
        <input id="address" v-model="address" required />
      </div>
      <div>
        <label for="product">產品名稱:</label>
        <input id="product" v-model="product" readonly />
      </div>
      <div>
        <label for="quantity">數量:</label>
        <input id="quantity" type="number" v-model="quantity" min="1" required />
      </div>
      <button type="submit">提交訂單</button>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    productName: String
  },
  data() {
    return {
      name: '',
      phone: '',
      address: '',
      product: this.productName,
      quantity: 1
    }
  },
  methods: {
    submitOrder() {
      const order = {
        name: this.name,
        phone: this.phone,
        address: this.address,
        product: this.product,
        quantity: this.quantity
      }
      this.$emit('submit-order', order)
    }
  }
}
</script>
