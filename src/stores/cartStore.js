import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import Swal from 'sweetalert2'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cartItems')) || [])
  const discountCode = ref(localStorage.getItem('discountCode') || null)
  const appliedDiscount = ref(Number(localStorage.getItem('appliedDiscount')) || 0)
  const discountError = ref(null)

  const discountCodes = [
    { code: 'SAVE10', type: 'percentage', value: 10 },
    { code: 'SAVE20', type: 'percentage', value: 20 },
    { code: 'MINUS100', type: 'fixed', value: 100 },
    { code: 'MINUS500', type: 'fixed', value: 500 }
  ]

  const totalPrice = computed(() =>
    items.value.reduce((sum, product) => sum + product.price * product.quantity, 0)
  )

  const finalPrice = computed(() => {
    return Math.max(0, totalPrice.value - appliedDiscount.value)
  })

  const applyDiscountCode = (code) => {
    const discount = discountCodes.find((d) => d.code === code)
    if (discount) {
      discountCode.value = code
      discountError.value = null
      appliedDiscount.value =
        discount.type === 'percentage' ? (totalPrice.value * discount.value) / 100 : discount.value
      localStorage.setItem('discountCode', discountCode.value)
      localStorage.setItem('appliedDiscount', appliedDiscount.value.toString())
    } else {
      discountCode.value = null
      appliedDiscount.value = 0
      discountError.value = '無效的優惠碼'
      localStorage.removeItem('discountCode')
      localStorage.removeItem('appliedDiscount')
    }
  }

  const addToCart = (product) => {
    const existingItem = items.value.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.maxQuantity) {
        existingItem.quantity++
      } else {
        Swal.fire({
          title: '購買數量超過限制',
          text: `商品 ${product.name} 的最大購買數量為 ${product.maxQuantity}`,
          icon: 'warning',
          confirmButtonText: '了解',
          timer: 1500,
          timerProgressBar: true
        })
      }
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  const decreaseQuantity = (productId) => {
    const item = items.value.find((item) => item.id === productId)
    if (item && item.quantity > 1) {
      item.quantity--
    }
  }

  const removeProduct = (productId) => {
    items.value = items.value.filter((item) => item.id !== productId)
  }

  const clearCart = () => {
    items.value = []
    discountCode.value = null
    appliedDiscount.value = 0
    localStorage.removeItem('cartItems')
    localStorage.removeItem('discountCode')
    localStorage.removeItem('appliedDiscount')
  }

  watch(
    items,
    (newItems) => {
      localStorage.setItem('cartItems', JSON.stringify(newItems))
    },
    { deep: true }
  )

  watch(totalPrice, (newTotalPrice) => {
    if (discountCode.value) {
      const discount = discountCodes.find((d) => d.code === discountCode.value)
      if (discount && discount.type === 'percentage') {
        appliedDiscount.value = (newTotalPrice * discount.value) / 100
        localStorage.setItem('appliedDiscount', appliedDiscount.value.toString())
      }
    }
  })

  return {
    items,
    discountCode,
    appliedDiscount,
    discountError,
    totalPrice,
    finalPrice,
    addToCart,
    decreaseQuantity,
    removeProduct,
    clearCart,
    applyDiscountCode
  }
})
