<template>
  <section class="px-4 mx-auto">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      <article
        v-for="product in products"
        :key="product.id"
        class="overflow-hidden transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105"
      >
        <img :src="product.image" :alt="product.name" class="object-cover w-full h-56" />

        <div class="p-6">
          <h3 class="mb-2 text-lg font-semibold">{{ product.name }}</h3>

          <p class="mb-2 text-gray-700">
            價格：<span class="font-bold">{{ product.price }}元</span>
          </p>

          <p class="mb-4 text-gray-500">最多購買：{{ product.maxQuantity }}件</p>

          <button
            @click="addToCart(product)"
            class="w-full py-2 font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            加入購物車
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      products: [
        {
          id: 1,
          name: '無線耳機',
          price: 1299,
          image: 'https://picsum.photos/id/3/200',
          maxQuantity: 20
        },
        {
          id: 2,
          name: '無線滑鼠',
          price: 599,
          image: 'https://picsum.photos/id/7/200',
          maxQuantity: 20
        },
        {
          id: 3,
          name: '雙肩背包',
          price: 2799,
          image: 'https://picsum.photos/id/9/200',
          maxQuantity: 20
        }
      ]
    }
  },
  methods: {
    addToCart(product) {
      this.$emit('add-to-shopcart', product)
    }
  }
}
</script>

<style scoped></style>
