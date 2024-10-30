<template>
  <section class="p-6 m-4 mt-0 bg-blue-200 rounded-lg shadow-md">
    <header>
      <h1 class="mb-6 text-3xl font-bold text-center">購物車</h1>
    </header>

    <p v-if="cartItems.length === 0" class="mb-4 text-center text-gray-500">購物車目前空空的</p>

    <ul>
      <li v-for="product in cartItems" :key="product.id" class="pb-4 mb-4 border-b">
        <article>
          <h3 class="text-xl font-semibold">{{ product.name }}</h3>
          <p class="text-gray-700">
            價格：<span class="font-bold">{{ product.price }}元</span>
          </p>
          <p class="text-gray-500">
            數量：<span class="font-bold">{{ product.quantity }}</span>
          </p>

          <div class="flex justify-between mt-2">
            <div class="flex items-center">
              <button
                @click="decreaseQuantity(product)"
                class="px-2 py-1 mr-2 bg-gray-200 rounded-lg"
              >
                減少
              </button>
              <button @click="increaseQuantity(product)" class="px-2 py-1 bg-gray-200 rounded-lg">
                增加
              </button>
            </div>
            <button @click="removeProduct(product.id)" class="text-red-500">刪除</button>
          </div>
        </article>
      </li>
    </ul>

    <section class="flex flex-wrap items-center mt-4 space-x-2">
      <input
        v-model="discountInput"
        type="text"
        placeholder="輸入優惠碼"
        class="flex-1 min-w-0 px-4 py-2 mb-2 border rounded sm:mb-0"
      />
      <button
        @click="applyDiscount"
        class="w-full px-4 py-2 text-white bg-blue-500 rounded sm:w-auto"
      >
        使用優惠碼
      </button>
    </section>

    <p v-if="discountError" class="mt-2 text-red-500">{{ discountError }}</p>

    <p v-if="discountCode" class="mt-2 text-green-500">
      已使用優惠碼：{{ discountCode }}，節省 {{ appliedDiscount }} 元
    </p>

    <p class="mt-4 text-lg font-semibold text-right">
      總價：<span class="text-blue-600">{{ finalPrice }}元</span>
    </p>

    <footer>
      <button
        @click="checkout"
        class="w-full py-2 mt-6 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
      >
        結帳
      </button>
    </footer>

    <div
      v-if="showOrderForm"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <section class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 class="mb-4 text-xl font-bold">資料填寫</h2>

        <ul class="mb-4">
          <li v-for="product in cartItems" :key="product.id" class="flex justify-between">
            <span>{{ product.name }} (x{{ product.quantity }})</span>
            <span>{{ product.price * product.quantity }} 元</span>
          </li>
        </ul>

        <p class="mb-4 text-lg font-semibold text-right">
          總價：<span class="text-blue-600">{{ finalPrice }} 元</span>
        </p>

        <form @submit.prevent="confirmCheckout">
          <div class="mb-4">
            <label for="name" class="block mb-1">姓名</label>
            <input
              id="name"
              v-model="orderName"
              type="text"
              required
              class="w-full px-4 py-2 border rounded"
            />
          </div>

          <div class="mb-4">
            <label for="phone" class="block mb-1">聯絡電話</label>
            <input
              id="phone"
              v-model="orderPhone"
              type="tel"
              required
              class="w-full px-4 py-2 border rounded"
            />
          </div>

          <div class="mb-4">
            <label for="address" class="block mb-1">地址</label>
            <input
              id="address"
              v-model="orderAddress"
              type="text"
              required
              class="w-full px-4 py-2 border rounded"
            />
          </div>

          <div class="flex justify-between">
            <button
              type="submit"
              class="w-full py-2 mt-4 mr-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              確認付款
            </button>

            <button
              type="button"
              @click="cancelOrder"
              class="w-full py-2 mt-4 font-semibold text-white bg-gray-400 rounded-lg hover:bg-gray-500"
            >
              取消
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<script>
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cartStore'
import Swal from 'sweetalert2'

export default {
  setup() {
    const cartStore = useCartStore()
    const discountInput = ref('')
    const showOrderForm = ref(false)
    const orderName = ref('')
    const orderPhone = ref('')
    const orderAddress = ref('')

    const cartItems = computed(() => cartStore.items)

    const finalPrice = computed(() => {
      const total = cartStore.totalPrice
      const discount = cartStore.appliedDiscount
      return Math.max(0, total - discount)
    })

    const discountCode = computed(() => cartStore.discountCode)
    const appliedDiscount = computed(() => cartStore.appliedDiscount)
    const discountError = computed(() => cartStore.discountError)

    const applyDiscount = () => {
      cartStore.applyDiscountCode(discountInput.value)
      discountInput.value = ''
    }

    const increaseQuantity = (product) => {
      cartStore.addToCart(product)
    }

    const decreaseQuantity = (product) => {
      const existingItem = cartStore.items.find((item) => item.id === product.id)
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1
      }
    }

    const removeProduct = (productId) => {
      Swal.fire({
        title: '確定要刪除該商品嗎？',
        text: '這個動作將無法恢復',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '是的，刪除它',
        cancelButtonText: '取消'
      }).then((result) => {
        if (result.isConfirmed) {
          cartStore.removeProduct(productId)
          Swal.fire('已刪除！', '該商品已被移出購物車。', 'success')
        }
      })
    }

    const checkout = () => {
      showOrderForm.value = true
    }

    const confirmCheckout = () => {
      if (finalPrice.value <= 0) {
        Swal.fire({
          title: '無法結帳',
          text: '總金額不能為 0 元，請添加商品到購物車。',
          icon: 'error',
          confirmButtonText: '了解',
          timer: 3000,
          timerProgressBar: true
        })
        return
      }

      cartStore.clearCart()
      showOrderForm.value = false
      Swal.fire({
        title: '付款成功！',
        text: `謝謝您的購買！`,
        icon: 'success',
        confirmButtonText: '好的',
        timer: 3000,
        timerProgressBar: true
      })
    }

    const cancelOrder = () => {
      showOrderForm.value = false
    }

    return {
      cartItems,
      finalPrice,
      discountCode,
      appliedDiscount,
      discountError,
      discountInput,
      applyDiscount,
      increaseQuantity,
      decreaseQuantity,
      removeProduct,
      checkout,
      confirmCheckout,
      cancelOrder,
      showOrderForm,
      orderName,
      orderPhone,
      orderAddress
    }
  }
}
</script>
