import * as InAppPurchases from 'expo-in-app-purchases';

export interface Product {
  productId: string;
  price: string;
  currency: string;
  localizedPrice: string;
  title: string;
  description: string;
  type: 'subscription' | 'consumable' | 'nonConsumable';
}

export interface Purchase {
  productId: string;
  purchaseToken: string;
  transactionId: string;
  transactionDate: number;
  transactionState: number;
}

class InAppPurchaseService {
  private isInitialized = false;
  private products: Product[] = [];

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      const isAvailable = await InAppPurchases.isAvailableAsync();
      if (!isAvailable) {
        console.log('In-app purchases not available on this device');
        return false;
      }

      await InAppPurchases.connectAsync();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize in-app purchases:', error);
      return false;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Product IDs that match App Store Connect
      // Note: These may need to be adjusted based on what's available in App Store Connect
      const productIds = [
        'com.floramind.premium.monthly',  // Use this if available
        'com.floramind.premium.yearly',   // Use this if available
        'com.floramind.identifications.pack10',  // Use this if available
        'com.floramind.identifications.pack50'   // Use this if available
      ];

      console.log('Requesting products with IDs:', productIds);

      const result = await InAppPurchases.getProductsAsync(productIds);
      
      console.log('IAP Response:', result);

      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        this.products = result.results.map(item => ({
          productId: item.productId,
          price: item.price,
          currency: item.currency,
          localizedPrice: item.localizedPrice,
          title: item.title,
          description: item.description,
          type: item.type as 'subscription' | 'consumable' | 'nonConsumable'
        }));

        console.log('Products loaded successfully:', this.products);
      } else {
        console.error('Failed to load products. Response code:', result.responseCode);
        console.error('Error message:', result.errorMessage);
      }

      return this.products;
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  }

  async purchaseProduct(productId: string): Promise<Purchase | null> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const result = await InAppPurchases.purchaseItemAsync(productId);
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        return {
          productId: result.results[0].productId,
          purchaseToken: result.results[0].purchaseToken,
          transactionId: result.results[0].transactionId,
          transactionDate: result.results[0].transactionDate,
          transactionState: result.results[0].transactionState
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to purchase product:', error);
      return null;
    }
  }

  async restorePurchases(): Promise<Purchase[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const result = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (result.responseCode === InAppPurchases.IAPResponseCode.OK) {
        return result.results.map(item => ({
          productId: item.productId,
          purchaseToken: item.purchaseToken,
          transactionId: item.transactionId,
          transactionDate: item.transactionDate,
          transactionState: item.transactionState
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      return [];
    }
  }

  async finishTransaction(purchase: Purchase): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const result = await InAppPurchases.finishTransactionAsync(
        purchase.transactionId,
        true
      );

      return result.responseCode === InAppPurchases.IAPResponseCode.OK;
    } catch (error) {
      console.error('Failed to finish transaction:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Failed to disconnect from in-app purchases:', error);
    }
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find(product => product.productId === productId);
  }

  isSubscription(productId: string): boolean {
    const product = this.getProductById(productId);
    return product?.type === 'subscription';
  }

  isConsumable(productId: string): boolean {
    const product = this.getProductById(productId);
    return product?.type === 'consumable';
  }
}

export default new InAppPurchaseService();
