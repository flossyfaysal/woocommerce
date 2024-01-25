/**
 * External dependencies
 */
import type { Page, Response } from '@playwright/test';
import type { FrontendUtils } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import { SIMPLE_VIRTUAL_PRODUCT_NAME } from '../checkout/constants';
import { CheckoutPage } from '../checkout/checkout.page';

type TemplateCustomizationTest = {
	visitPage: ( props: {
		frontendUtils: FrontendUtils;
		page: Page;
	} ) => Promise< void | Response | null >;
	templateName: string;
	templatePath: string;
	templateType: string;
	fallbackTemplate?: {
		templateName: string;
		templatePath: string;
	};
};

export const CUSTOMIZABLE_WC_TEMPLATES: TemplateCustomizationTest[] = [
	{
		visitPage: async ( { frontendUtils } ) =>
			await frontendUtils.goToShop(),
		templateName: 'Product Catalog',
		templatePath: 'archive-product',
		templateType: 'wp_template',
	},
	{
		visitPage: async ( { page } ) =>
			await page.goto( '/?s=shirt&post_type=product' ),
		templateName: 'Product Search Results',
		templatePath: 'product-search-results',
		templateType: 'wp_template',
	},
	{
		visitPage: async ( { page } ) => await page.goto( '/color/blue' ),
		templateName: 'Products by Attribute',
		templatePath: 'taxonomy-product_attribute',
		templateType: 'wp_template',
		fallbackTemplate: {
			templateName: 'Product Catalog',
			templatePath: 'archive-product',
		},
	},
	{
		visitPage: async ( { page } ) =>
			await page.goto( '/product-category/clothing' ),
		templateName: 'Products by Category',
		templatePath: 'taxonomy-product_cat',
		templateType: 'wp_template',
		fallbackTemplate: {
			templateName: 'Product Catalog',
			templatePath: 'archive-product',
		},
	},
	{
		visitPage: async ( { page } ) =>
			await page.goto( '/product-tag/recommended/' ),
		templateName: 'Products by Tag',
		templatePath: 'taxonomy-product_tag',
		templateType: 'wp_template',
		fallbackTemplate: {
			templateName: 'Product Catalog',
			templatePath: 'archive-product',
		},
	},
	{
		visitPage: async ( { page } ) => await page.goto( '/product/hoodie' ),
		templateName: 'Single Product',
		templatePath: 'single-product',
		templateType: 'wp_template',
	},
	{
		visitPage: async ( { frontendUtils } ) =>
			await frontendUtils.goToCart(),
		templateName: 'Page: Cart',
		templatePath: 'page-cart',
		templateType: 'wp_template',
	},
	{
		visitPage: async ( { frontendUtils } ) => {
			await frontendUtils.goToShop();
			await frontendUtils.addToCart();
			await frontendUtils.goToCheckout();
		},
		templateName: 'Page: Checkout',
		templatePath: 'page-checkout',
		templateType: 'wp_template',
	},
	{
		visitPage: async ( { frontendUtils, page } ) => {
			const checkoutPage = new CheckoutPage( { page } );
			await frontendUtils.goToShop();
			await frontendUtils.addToCart( SIMPLE_VIRTUAL_PRODUCT_NAME );
			await frontendUtils.goToCheckout();
			await checkoutPage.fillInCheckoutWithTestData();
			await checkoutPage.placeOrder();
		},
		templateName: 'Order Confirmation',
		templatePath: 'order-confirmation',
		templateType: 'wp_template',
	},
];

export const WC_TEMPLATES_SLUG = 'woocommerce/woocommerce';
