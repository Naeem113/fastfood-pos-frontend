import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { COMMON_IMPORTS } from '../../../shared/common';

// ─── Models ────────────────────────────────────────────────────────────────

export interface MenuCategory {
  id:    string;
  name:  string;
  icon:  string;
  items: MenuItem[];
}

export interface MenuItem {
  id:          string;
  name:        string;
  price:       number;
  icon:        string;
  isPopular:   boolean;
  isAvailable: boolean;
  categoryId:  string;
  variant?:    string;
}

export interface CartLine {
  id:    string;
  name:  string;
  price: number;
  icon:  string;
  qty:   number;
  note?: string;
}

export interface HeldOrder {
  name:  string;
  lines: CartLine[];
}

export type PaymentMethod = 'cash' | 'card' | 'online';
export type ItemFilterKey = 'all' | 'available' | 'popular';

export interface PaymentMethodOption {
  key:   PaymentMethod;
  label: string;
  icon:  string;
}

@Component({
  selector: 'app-cart',
  imports: [...COMMON_IMPORTS],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  // ── clock ──────────────────────────────────────────────────────────────
  currentTime = '';
  private clockInterval: ReturnType<typeof setInterval> | null = null;

  // ── route / session data ───────────────────────────────────────────────
  tableName  = 'Table 07';
  tableId    = '';
  guestCount = 3;

  // ── categories + items ─────────────────────────────────────────────────
  categories: MenuCategory[] = MOCK_CATEGORIES;

  private get allItems(): MenuItem[] {
    return this.categories.flatMap(c => c.items);
  }

  selectedCategory: MenuCategory | null = null;

  readonly itemFilters: { key: ItemFilterKey; label: string }[] = [
    { key: 'all',       label: 'All'       },
    { key: 'available', label: 'Available' },
    { key: 'popular',   label: 'Popular'   },
  ];
  activeItemFilter: ItemFilterKey = 'all';
  itemSearch = '';

  get filteredItems(): MenuItem[] {
    const q = this.itemSearch.toLowerCase().trim();

    let items = this.selectedCategory
      ? this.selectedCategory.items
      : this.allItems;

    if (this.activeItemFilter === 'available') {
      items = items.filter(i => i.isAvailable);
    } else if (this.activeItemFilter === 'popular') {
      items = items.filter(i => i.isPopular);
    }

    if (q) {
      items = items.filter(i => i.name.toLowerCase().includes(q));
    }

    return items;
  }

  // ── cart ───────────────────────────────────────────────────────────────
  cartItems: CartLine[] = [];
  orderNote  = '';
  heldOrders: HeldOrder[] = [];

  get subtotal(): number {
    return this.cartItems.reduce((sum, l) => sum + l.price * l.qty, 0);
  }

  get tax(): number {
    return Math.round(this.subtotal * 0.16);
  }

  get discount(): number {
    return 0; // wire to customer discount if needed
  }

  get total(): number {
    return this.subtotal + this.tax - this.discount;
  }

  // ── payment modal ──────────────────────────────────────────────────────
  showPayModal = false;

  readonly paymentMethods: PaymentMethodOption[] = [
    { key: 'cash',   label: 'Cash',   icon: '💵' },
    { key: 'card',   label: 'Card',   icon: '💳' },
    { key: 'online', label: 'Online', icon: '📱' },
  ];
  selectedPayMethod: PaymentMethod = 'cash';
  cashTendered = 0;

  get change(): number {
    return Math.max(0, this.cashTendered - this.total);
  }

  readonly quickAmounts = [500, 1000, 2000, 5000];

  get canConfirmPayment(): boolean {
    if (this.selectedPayMethod === 'cash') {
      return this.cashTendered >= this.total;
    }
    return true;
  }

  // ── KOT toast ──────────────────────────────────────────────────────────
  showKotToast  = false;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  // ──────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Read table + guest data from router state or query params
    const state = this.router.getCurrentNavigation()?.extras?.state as
      { tableId?: string; tableName?: string; guestCount?: number } | undefined;

    if (state) {
      this.tableId    = state.tableId    ?? '';
      this.tableName  = state.tableName  ?? 'Table 07';
      this.guestCount = state.guestCount ?? 3;
    } else {
      // fallback: read query params
      this.route.queryParams.subscribe(p => {
        this.tableId    = p['tableId']    ?? '';
        this.tableName  = p['tableName']  ?? 'Table 07';
        this.guestCount = +(p['guests']   ?? 3);
      });
    }

    this.startClock();

    // In production: load categories from API
    // this.menuService.getCategories().subscribe(cats => this.categories = cats);
  }

  ngOnDestroy(): void {
    if (this.clockInterval)  clearInterval(this.clockInterval);
    if (this.toastTimeout)   clearTimeout(this.toastTimeout);
  }

  private startClock(): void {
    const tick = () => {
      this.currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
    };
    tick();
    this.clockInterval = setInterval(tick, 1000);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Category helpers
  // ──────────────────────────────────────────────────────────────────────

  selectCategory(cat: MenuCategory | null): void {
    this.selectedCategory = cat;
    this.itemSearch       = '';
    this.activeItemFilter = 'all';
  }

  getAvailableCount(cat: MenuCategory): number {
    return cat.items.filter(i => i.isAvailable).length;
  }

  // ──────────────────────────────────────────────────────────────────────
  // Cart helpers
  // ──────────────────────────────────────────────────────────────────────

  addToCart(item: MenuItem): void {
    if (!item.isAvailable) return;
    const existing = this.cartItems.find(l => l.id === item.id);
    if (existing) {
      existing.qty++;
    } else {
      this.cartItems.push({
        id:    item.id,
        name:  item.name,
        price: item.price,
        icon:  item.icon,
        qty:   1,
      });
    }
  }

  increaseQty(index: number): void {
    this.cartItems[index].qty++;
  }

  decreaseQty(index: number): void {
    if (this.cartItems[index].qty <= 1) {
      this.removeLine(index);
    } else {
      this.cartItems[index].qty--;
    }
  }

  removeLine(index: number): void {
    this.cartItems.splice(index, 1);
  }

  clearCart(): void {
    this.cartItems = [];
    this.orderNote  = '';
  }

  trackByIndex(index: number): number {
    return index;
  }

  // ──────────────────────────────────────────────────────────────────────
  // KOT
  // ──────────────────────────────────────────────────────────────────────

  sendKOT(): void {
    if (!this.cartItems.length) return;

    // In production: this.kotService.send({ tableId, items: this.cartItems })
    console.log('KOT sent:', { table: this.tableName, items: this.cartItems });

    this.showKotToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => (this.showKotToast = false), 3000);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Hold / Recall
  // ──────────────────────────────────────────────────────────────────────

  holdOrder(): void {
    if (!this.cartItems.length) return;
    const holdName = `Hold ${this.heldOrders.length + 1}`;
    this.heldOrders.push({ name: holdName, lines: [...this.cartItems] });
    this.clearCart();
  }

  recallHeldOrder(index: number): void {
    const held = this.heldOrders[index];
    if (!held) return;
    this.cartItems  = [...held.lines];
    this.heldOrders.splice(index, 1);
  }

  recallKOT(): void {
    // In production: fetch last KOT from service
    console.log('Recall last KOT for table:', this.tableId);
  }

  // ──────────────────────────────────────────────────────────────────────
  // Payment
  // ──────────────────────────────────────────────────────────────────────

  openPayment(): void {
    if (!this.cartItems.length) return;
    this.cashTendered      = 0;
    this.selectedPayMethod = 'cash';
    this.showPayModal      = true;
  }

  closePayModal(): void {
    this.showPayModal = false;
  }

  confirmPayment(): void {
    if (!this.canConfirmPayment) return;

    const payload = {
      tableId:       this.tableId,
      tableName:     this.tableName,
      guestCount:    this.guestCount,
      items:         this.cartItems,
      subtotal:      this.subtotal,
      tax:           this.tax,
      discount:      this.discount,
      total:         this.total,
      paymentMethod: this.selectedPayMethod,
      cashTendered:  this.selectedPayMethod === 'cash' ? this.cashTendered : null,
      change:        this.selectedPayMethod === 'cash' ? this.change : null,
      orderNote:     this.orderNote,
    };

    // In production: this.orderService.checkout(payload).subscribe(...)
    console.log('Payment confirmed:', payload);

    this.closePayModal();
    this.clearCart();
    this.heldOrders = [];

    // Navigate back to table selection after checkout
    this.router.navigate(['/pos/dine-in'], {
      state: { cleared: this.tableId },
    });
  }

  // ──────────────────────────────────────────────────────────────────────
  // Navigation
  // ──────────────────────────────────────────────────────────────────────

  goBack(): void {
    this.router.navigate(['/pos/dine-in']);
  }
}

// ─── Mock data (replace with API calls) ────────────────────────────────────

const MOCK_CATEGORIES: MenuCategory[] = [
  {
    id: 'burgers', name: 'Burgers', icon: '🍔',
    items: [
      { id: 'b1', name: 'Zinger burger',   price: 450,  icon: '🍔', isPopular: true,  isAvailable: true,  categoryId: 'burgers' },
      { id: 'b2', name: 'Smash burger',    price: 550,  icon: '🍔', isPopular: true,  isAvailable: true,  categoryId: 'burgers' },
      { id: 'b3', name: 'BBQ burger',      price: 500,  icon: '🍔', isPopular: false, isAvailable: true,  categoryId: 'burgers' },
      { id: 'b4', name: 'Fish burger',     price: 480,  icon: '🍔', isPopular: false, isAvailable: false, categoryId: 'burgers' },
    ],
  },
  {
    id: 'pizza', name: 'Pizza', icon: '🍕',
    items: [
      { id: 'p1', name: 'BBQ chicken pizza', price: 1200, icon: '🍕', isPopular: true,  isAvailable: true, categoryId: 'pizza' },
      { id: 'p2', name: 'Margherita',        price: 900,  icon: '🍕', isPopular: false, isAvailable: true, categoryId: 'pizza' },
      { id: 'p3', name: 'Pepperoni',         price: 1100, icon: '🍕', isPopular: true,  isAvailable: true, categoryId: 'pizza' },
    ],
  },
  {
    id: 'sides', name: 'Sides', icon: '🍟',
    items: [
      { id: 's1', name: 'Loaded fries',  price: 250, icon: '🍟', isPopular: true,  isAvailable: true, categoryId: 'sides' },
      { id: 's2', name: 'Onion rings',   price: 200, icon: '🧅', isPopular: false, isAvailable: true, categoryId: 'sides' },
      { id: 's3', name: 'Cheese nachos', price: 300, icon: '🌮', isPopular: false, isAvailable: true, categoryId: 'sides' },
      { id: 's4', name: 'Garlic bread',  price: 180, icon: '🥖', isPopular: false, isAvailable: true, categoryId: 'sides' },
    ],
  },
  {
    id: 'drinks', name: 'Drinks', icon: '🥤',
    items: [
      { id: 'd1', name: 'Classic cola',      price: 120, icon: '🥤', isPopular: false, isAvailable: true, categoryId: 'drinks' },
      { id: 'd2', name: 'Mango smoothie',    price: 280, icon: '🥭', isPopular: true,  isAvailable: true, categoryId: 'drinks' },
      { id: 'd3', name: 'Mint lemonade',     price: 220, icon: '🍋', isPopular: false, isAvailable: true, categoryId: 'drinks' },
      { id: 'd4', name: 'Strawberry shake',  price: 320, icon: '🍓', isPopular: true,  isAvailable: true, categoryId: 'drinks' },
    ],
  },
  {
    id: 'wraps', name: 'Wraps', icon: '🌯',
    items: [
      { id: 'w1', name: 'Chicken wrap',    price: 380, icon: '🌯', isPopular: false, isAvailable: true, categoryId: 'wraps' },
      { id: 'w2', name: 'Falafel wrap',    price: 350, icon: '🌯', isPopular: false, isAvailable: true, categoryId: 'wraps' },
      { id: 'w3', name: 'Shawarma plate',  price: 650, icon: '🫓', isPopular: true,  isAvailable: true, categoryId: 'wraps' },
    ],
  },
];
