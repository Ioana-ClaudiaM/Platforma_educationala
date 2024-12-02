<template>
    <div class="card shopping-card">
        <div class="shopping-wrapper">
            <div class="shopping-header">
                <h2 class="card-title">
                    🛒 Lista de Cumpărături</h2>
            </div>
            <div class="items-list-container">
                <transition-group name="item-list" tag="ul" class="items-list">
                    <li v-for="(item) in items" :key="item.id" class="item-row">
                        <div class="item-details">
                            <span class="item-name">{{ item.name }}</span>
                            <div class="item-actions">
                                <span class="item-price">{{ item.price.toFixed(2) }} RON</span>

                            </div>
                        </div>
                    </li>
                </transition-group>
            </div>

            <div class="shopping-summary">
                <div class="total-section">
                    <span class="total-label">Total</span>
                    <span class="total-amount">{{ totalCost.toFixed(2) }} RON</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [
                { id: 1, name: "Mere proaspete", price: 10 },
                { id: 2, name: "Lapte integral", price: 7 },
                { id: 3, name: "Pâine integrală", price: 5 },
                { id: 4, name: "Salată verde", price: 3 },
                { id: 5, name: "Piept de pui", price: 25 },
            ],
            newItemName: '',
            newItemPrice: null,
            nextId: 6
        };
    },
    computed: {
        totalCost() {
            return this.items.reduce((total, item) => total + item.price, 0);
        }
    },
    methods: {
    }
};
</script>

<style scoped>
.shopping-card {
    background-color: #baf7d8;
    border:10px solid #7ef8bb;
}

.shopping-wrapper {
    padding: 14px;
}

.shopping-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.shopping-header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}

.items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    font-family: "Playwrite HR Lijeva";
    font-size: 0.8rem;
}

.item-row {
    background-color: white;
    margin-bottom: 12px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.item-row:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.07);
}

.item-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
}

.item-price {
    font-weight: 600;
    color: #10b981;
}

.shopping-summary {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "Playwrite HR Lijeva";
}

.total-label {
    font-size: 1rem;
    font-weight: 600;
    color: #1a2b3b;
}

.total-amount {
    font-size: 1rem;
    font-weight: 700;
    color: #10b981;
}

</style>