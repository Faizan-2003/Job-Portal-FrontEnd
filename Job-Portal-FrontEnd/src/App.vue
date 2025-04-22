<template>
    <div>
        <!-- Conditionally render the header -->
        <navigation v-if="showHeader" />
        <router-view />
    </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navigation from "./components/header.vue";

export default {
    name: "App",
    components: {
        Navigation,
    },
    setup() {
        const route = useRoute();

        const showHeader = computed(() => {
            return !["/", "/register"].includes(route.path);
        });

        return { showHeader };
    },
};
</script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
