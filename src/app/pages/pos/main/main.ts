import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PosHeader } from '../../../shared/components/pos/pos-header/pos-header';
import { PosFooter } from '../../../shared/components/pos/pos-footer/pos-footer';
import { Pos } from "../../../layouts/pos/pos";
import { Router } from '@angular/router';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  emoji: string;
  tag?: string;
  tagColor?: string;
}

export interface CartItem {
  product: Product;
  qty: number;
  addons: string[];
  addonPrice: number;
}
@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule, PosHeader, PosFooter, Pos],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
})
export class Main {

  router = inject(Router);
  orderTypes = [
    {
      title: 'Walk In',
      subtitle: 'No reservation',
      path: 'dine-in',
      icon: '🚶',
      bgColor: 'bg-blue-500'
    },
    {
      title: 'Take Away',
      subtitle: '12 orders today',
      path: 'takeaway',
      icon: '🥡',
      bgColor: 'bg-amber-500'
    },
    {
      title: 'Delivery',
      subtitle: '3 riders active',
      path: 'delivery',
      icon: '🚲',
      bgColor: 'bg-violet-500'
    },
    {
      title: 'Dine In',
      subtitle: '6 tables active',
      path: 'dine-in',
      icon: '🍽️',
      bgColor: 'bg-emerald-600'
    }
  ];


  searchQuery = '';
  activeCategory = 'ALL';
  orderType: 'Dine In' | 'Takeaway' | 'Delivery' | string = 'Dine In';

  categories = ['ALL', 'BURGER', 'PIZZA', 'DRINKS', 'SIDES'];

  products: Product[] = [
    { id: 1, name: 'Classic Smash Burger', price: 1800, category: 'BURGER', stock: 0,  emoji: '🍔', tag: 'Out of Stock', tagColor: 'red' },
    { id: 2, name: 'Zinger Burger',        price: 100,  category: 'BURGER', stock: 19, emoji: '🍔' },
    { id: 3, name: 'CronCrust Pizza',      price: 1500, category: 'PIZZA',  stock: 10, emoji: '🍕', tag: 'Low Stock', tagColor: 'amber' },
    { id: 4, name: 'BBQ Chicken Pizza',    price: 1200, category: 'PIZZA',  stock: 25, emoji: '🍕' },
    { id: 5, name: 'Loaded Fries',         price: 450,  category: 'SIDES',  stock: 50, emoji: '🍟' },
    { id: 6, name: 'Onion Rings',          price: 350,  category: 'SIDES',  stock: 30, emoji: '🧅' },
    { id: 7, name: 'Pepsi Large',          price: 200,  category: 'DRINKS', stock: 80, emoji: '🥤' },
    { id: 8, name: 'Lemonade',             price: 280,  category: 'DRINKS', stock: 40, emoji: '🍋' },
    { id: 9, name: 'Double Decker',        price: 2200, category: 'BURGER', stock: 15, emoji: '🍔' },
    { id:10, name: 'Margherita Pizza',     price: 980,  category: 'PIZZA',  stock: 8,  emoji: '🍕', tag: 'Low Stock', tagColor: 'amber' },
  ];

  cart: CartItem[] = [
    {
      product: this.products[0],
      qty: 1,
      addons: ['Small (+Rs30)', 'Cheese (+Rs10)'],
      addonPrice: 40
    }
  ];

  discountApplied = false;
  discountPct = 10;

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchCat = this.activeCategory === 'ALL' || p.category === this.activeCategory;
      const matchSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  addToCart(product: Product) {
    if (product.stock === 0) return;
    const existing = this.cart.find(c => c.product.id === product.id);
    if (existing) { existing.qty++; }
    else { this.cart.push({ product, qty: 1, addons: [], addonPrice: 0 }); }
  }

  increment(item: CartItem) { item.qty++; }
  decrement(item: CartItem) {
    if (item.qty > 1) item.qty--;
    else this.removeItem(item);
  }
  removeItem(item: CartItem) {
    this.cart = this.cart.filter(c => c !== item);
  }

  itemTotal(item: CartItem): number {
    return (item.product.price + item.addonPrice) * item.qty;
  }

  get subtotal(): number { return this.cart.reduce((s, i) => s + this.itemTotal(i), 0); }
  get tax(): number { return Math.round(this.subtotal * 0.05); }
  get discount(): number { return this.discountApplied ? Math.round(this.subtotal * this.discountPct / 100) : 0; }
  get total(): number { return this.subtotal + this.tax - this.discount; }
  get cartCount(): number { return this.cart.reduce((s, i) => s + i.qty, 0); }

  isInCart(product: Product): boolean {
    return this.cart.some(c => c.product.id === product.id);
  }

  clearCart() { this.cart = []; }

  toggleDiscount() { this.discountApplied = !this.discountApplied; }

  pay() { alert(`✅ Order placed! Total: Rs${this.total.toLocaleString()}`); this.clearCart(); }

}
