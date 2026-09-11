import type { LocaleCode } from "@/types";

export const dict = {
  "validation.store": { en: "This store is not accepting pickup orders. Please choose another store.", zh: "该门店暂不接受自提订单，请重新选店。" },
  "validation.unavailable": { en: "An item is unavailable at this store. Please update your bag.", zh: "有商品在当前门店不可售，请调整购物袋。" },
  "validation.options": { en: "Please select available options for every required group.", zh: "请检查必选规格与售罄选项。" },
  "validation.quantity": { en: "Choose between 1 and 99 items.", zh: "单项数量须为 1–99 件。" },
  "validation.voucher": { en: "This voucher is no longer eligible. Please choose another voucher.", zh: "该优惠券已不满足使用条件，请重新选择。" },
  "validation.time": { en: "This pickup time has passed. Please choose another time.", zh: "该取餐时间已过，请重新选择。" },
  // tabs
  "tab.home": { en: "Home", zh: "首页" },
  "tab.menu": { en: "Menu", zh: "点单" },
  "tab.orders": { en: "Orders", zh: "订单" },
  "tab.me": { en: "Me", zh: "我的" },

  // common
  "common.pickup": { en: "Pickup", zh: "自提" },
  "common.delivery": { en: "Delivery", zh: "外送" },
  "common.comingSoon": { en: "Coming soon", zh: "敬请期待" },
  "common.login": { en: "Login", zh: "登录" },
  "common.logout": { en: "Log out", zh: "退出登录" },
  "common.continue": { en: "Continue", zh: "继续" },
  "common.confirm": { en: "Confirm", zh: "确认" },
  "common.cancel": { en: "Cancel", zh: "取消" },
  "common.yes": { en: "Yes", zh: "是" },
  "common.no": { en: "No", zh: "否" },
  "common.close": { en: "Close", zh: "关闭" },
  "common.back": { en: "Back", zh: "返回" },
  "common.retry": { en: "Retry", zh: "重试" },
  "common.soldOut": { en: "Sold Out", zh: "售罄" },
  "common.new": { en: "New", zh: "新品" },
  "common.free": { en: "Free", zh: "免费" },
  "common.optional": { en: "Optional", zh: "可选" },
  "common.km": { en: "km", zh: "公里" },

  // home
  "home.welcome": { en: "Welcome to ChaTea", zh: "欢迎来到 ChaTea" },
  "home.tagline": { en: "Pure at Heart · Matcha Series", zh: "纯粹本心 · 抹茶系列" },
  "home.orderNow": { en: "Order Now", zh: "立即点单" },
  "home.pickupDesc": { en: "Order now, made instantly", zh: "即点即做" },
  "home.deliveryDesc": { en: "Delivered to you", zh: "配送到家" },
  "home.member.title": { en: "SIP, COLLECT, UNLOCK", zh: "畅饮 · 集杯 · 解锁" },
  "home.member.sub": { en: "More Sips, More Wins", zh: "越喝越有惊喜" },
  "home.member.cta": { en: "Login & Get Reward", zh: "登录领奖励" },

  // store select
  "store.title": { en: "Select Your Pickup Store", zh: "选择自提门店" },
  "store.search": { en: "Enter store name...", zh: "输入门店名称…" },
  "store.nearby": { en: "Nearby Store", zh: "附近门店" },
  "store.favorites": { en: "Favorites", zh: "收藏" },
  "store.preparing": { en: "Preparing", zh: "备餐中" },
  "store.cups": { en: "cups", zh: "杯" },
  "store.estTime": { en: "estimated time", zh: "预计" },
  "store.minutes": { en: "minutes", zh: "分钟" },
  "store.orderNow": { en: "ORDER NOW", zh: "去点单" },
  "store.noFavorites": { en: "No favorite stores yet", zh: "还没有收藏的门店" },
  "store.changeConfirm.title": { en: "Change store?", zh: "切换门店？" },
  "store.changeConfirm.body": { en: "Your cart items are from another store and will be cleared.", zh: "购物车内商品来自其他门店，切换后将被清空。" },

  // menu
  "menu.orderInstant": { en: "Order now, made instantly", zh: "即点即做" },
  "menu.selectStore": { en: "Select a store to start", zh: "请先选择门店" },
  "menu.searchPlaceholder": { en: "Search the menu...", zh: "搜索菜单…" },
  "menu.noResults": { en: "No matching drinks", zh: "没有找到匹配的饮品" },

  // product
  "product.showMore": { en: "Show more", zh: "展开" },
  "product.showLess": { en: "Show less", zh: "收起" },
  "product.teaBase": { en: "TEA BASE", zh: "茶底" },
  "product.remark": { en: "Remark", zh: "备注" },
  "product.remarkPlaceholder": { en: "e.g. no straw, less full", zh: "如：不要吸管、少满一点" },
  "product.addToBag": { en: "Add to Bag", zh: "加入购物车" },
  "product.placeOrder": { en: "Place the Order", zh: "立即下单" },
  "product.maxSelect": { en: "Choose up to", zh: "最多可选" },

  // cart
  "cart.title": { en: "Your Bag", zh: "购物车" },
  "cart.items": { en: "ITEMS", zh: "件商品" },
  "cart.empty": { en: "Empty", zh: "清空" },
  "cart.emptyState": { en: "Your bag is empty", zh: "购物车是空的" },
  "cart.emptyCta": { en: "Browse Menu", zh: "去点单" },
  "cart.checkout": { en: "CHECK OUT", zh: "去结算" },
  "cart.selectItems": { en: "Select items to check out", zh: "请勾选要结算的商品" },
  "cart.selectAll": { en: "Select all", zh: "全选" },

  // checkout
  "checkout.title": { en: "Your Order", zh: "确认订单" },
  "checkout.pickupTime": { en: "Pickup Time", zh: "取餐时间" },
  "checkout.selectTime": { en: "Select Time", zh: "选择时间" },
  "checkout.asap": { en: "ASAP (made instantly)", zh: "尽快（即点即做）" },
  "checkout.orderSummary": { en: "ORDER SUMMARY", zh: "订单明细" },
  "checkout.packagingFee": { en: "Packaging Fee", zh: "包装费" },
  "checkout.addVoucher": { en: "Add voucher", zh: "使用优惠券" },
  "checkout.noVoucher": { en: "No voucher", zh: "不使用" },
  "checkout.selectVoucher": { en: "Select a voucher", zh: "选择优惠券" },
  "checkout.paymentDetails": { en: "Payment Details", zh: "费用明细" },
  "checkout.totalDiscount": { en: "Total discount", zh: "优惠合计" },
  "checkout.voucherApplied": { en: "Voucher applied", zh: "优惠券抵扣" },
  "checkout.vat": { en: "VAT 12.00% (included)", zh: "增值税 12.00%（内含）" },
  "checkout.subtotal": { en: "Subtotal", zh: "小计" },
  "checkout.itemsSubtotal": { en: "Items subtotal", zh: "商品合计" },
  "checkout.paymentMethods": { en: "PAYMENT METHODS", zh: "支付方式" },
  "checkout.pay": { en: "PAY", zh: "支付" },
  "checkout.loginToOrder": { en: "Please log in to place an order", zh: "请先登录后下单" },

  // payment
  "pay.title": { en: "Payment", zh: "支付" },
  "pay.processing": { en: "Processing payment...", zh: "正在支付…" },
  "pay.chooseMethod": { en: "Choose a payment method", zh: "选择支付方式" },
  "pay.payNow": { en: "Pay Now", zh: "立即支付" },
  "pay.success.title": { en: "Payment Successful", zh: "支付成功" },
  "pay.success.body": { en: "Your order has been placed.", zh: "订单已提交。" },
  "pay.failed.title": { en: "Payment Failed", zh: "支付失败" },
  "pay.failed.body": { en: "Something went wrong. Please try again.", zh: "支付出现问题，请重试。" },
  "pay.cancelled.title": { en: "Payment Cancelled", zh: "支付已取消" },
  "pay.cancelled.body": { en: "You cancelled the payment.", zh: "你已取消支付。" },
  "pay.viewOrder": { en: "View Order", zh: "查看订单" },
  "pay.backToCart": { en: "Back to Cart", zh: "返回购物车" },
  "pay.simulateHint": { en: "Simulated payment — no real charge.", zh: "模拟支付，不产生真实扣款。" },
  "pay.outcome": { en: "Simulate outcome", zh: "模拟结果" },

  // methods
  "method.gcash": { en: "GCash", zh: "GCash" },
  "method.maya": { en: "Maya", zh: "Maya" },
  "method.qrph": { en: "QR Ph", zh: "QR Ph" },
  "method.card": { en: "Credit / Debit Card", zh: "信用卡 / 借记卡" },
  "method.cash_on_pickup": { en: "Cash on Pickup", zh: "取餐时付现" },

  // orders
  "orders.title": { en: "My Orders", zh: "我的订单" },
  "orders.empty": { en: "No orders yet", zh: "还没有订单" },
  "orders.all": { en: "All", zh: "全部" },
  "orders.active": { en: "Active", zh: "进行中" },
  "orders.completed": { en: "Completed", zh: "已完成" },
  "orders.reorder": { en: "View", zh: "查看" },
  "orders.pickupNo": { en: "Pickup No.", zh: "取餐号" },

  // order status
  "status.pending_payment": { en: "Pending Payment", zh: "待支付" },
  "status.paid": { en: "Paid", zh: "已支付" },
  "status.making": { en: "Making", zh: "制作中" },
  "status.ready": { en: "Ready for Pickup", zh: "待取餐" },
  "status.completed": { en: "Completed", zh: "已完成" },
  "status.cancelled": { en: "Cancelled", zh: "已取消" },

  // order detail
  "order.detail": { en: "Order Detail", zh: "订单详情" },
  "order.pickupInfo": { en: "Pickup Information", zh: "取餐信息" },
  "order.showTo": { en: "Show this number at the counter", zh: "取餐时向店员出示此号码" },
  "order.advance": { en: "Advance status (demo)", zh: "推进状态（演示）" },
  "order.timeline": { en: "Status Timeline", zh: "状态时间轴" },
  "order.total": { en: "Total Paid", zh: "实付" },

  // me
  "me.guest": { en: "Guest", zh: "访客" },
  "me.loginPrompt": { en: "Log in to unlock your benefits", zh: "登录解锁会员权益" },
  "me.points": { en: "Points", zh: "积分" },
  "me.memberPrice": { en: "Member Price", zh: "会员价" },
  "me.memberPriceHint": { en: "Show member prices when logged in", zh: "登录后展示会员价" },
  "me.language": { en: "Language", zh: "语言" },
  "me.settings": { en: "Settings", zh: "设置" },
  "me.tier": { en: "Tier", zh: "等级" },

  // login
  "login.welcome": { en: "WELCOME", zh: "欢迎" },
  "login.phone": { en: "Phone Number", zh: "手机号码" },
  "login.referral": { en: "Referral Code (Optional)", zh: "推荐码（可选）" },
  "login.terms": { en: "I have read and accept the Terms of Use and Privacy Policy.", zh: "我已阅读并接受服务条款和隐私政策。" },
  "login.otpHint": { en: "Prototype: any Philippine number works, no real OTP.", zh: "原型演示：任意菲律宾号码即可登录，无需真实验证码。" },
} as const;

export type DictKey = keyof typeof dict;

export function translate(key: DictKey, locale: LocaleCode): string {
  const entry = dict[key];
  return entry ? entry[locale] : key;
}
