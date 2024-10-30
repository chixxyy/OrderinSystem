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

          <p class="mb-2 text-gray-600">產品介紹：{{ product.description }}</p>

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
          price: 1200,
          image: '../../public/Earphone.jpg',
          description: '高音質無線耳機，適合日常使用和通勤。',
          maxQuantity: 10
        },
        {
          id: 2,
          name: '無線滑鼠',
          price: 500,
          image: '../../public/Mouse.jpg',
          description: '輕巧無線滑鼠，適合辦公與遊戲使用。',
          maxQuantity: 10
        },
        {
          id: 3,
          name: '雙肩背包',
          price: 850,
          image: '../../public/Backpack.jpg',
          description: '耐用雙肩背包，適合旅遊和上班族。',
          maxQuantity: 10
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
