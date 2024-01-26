/**
 * External dependencies
 */
import { expect, test as base } from '@woocommerce/e2e-playwright-utils';
import { adminFile, guestFile } from '@woocommerce/e2e-utils';

/**
 * Internal dependencies
 */
import { CheckoutPage } from '../checkout/checkout.page';
import { utilsLocalPickup } from '../local-pickup/utils.local-pickup';
import { REGULAR_PRICED_PRODUCT_NAME } from '../checkout/constants';

const test = base.extend< { checkoutPageObject: CheckoutPage } >( {
	checkoutPageObject: async ( { page }, use ) => {
		const pageObject = new CheckoutPage( {
			page,
		} );
		await use( pageObject );
	},
} );

test.describe( 'Merchant → Shipping', () => {
	test.use( { storageState: adminFile } );

	test( 'Merchant can enable shipping calculator and hide shipping costs before address is entered', async ( {
		admin,
		page,
		shippingUtils,
	} ) => {
		await utilsLocalPickup.openLocalPickupSettings( { admin } );
		await utilsLocalPickup.disableLocalPickup( { page } );

		await shippingUtils.openShippingSettings( { admin } );
		await shippingUtils.enableShippingCalculator( { page } );
		await shippingUtils.enableShippingCostsRequireAddress( { page } );

		await expect(
			page.getByLabel( 'Enable the shipping calculator on the cart page' )
		).toBeChecked();

		await expect(
			page.getByLabel( 'Hide shipping costs until an address is entered' )
		).toBeChecked();
	} );
} );

test.describe( 'Shopper → Shipping', () => {
	test.use( { storageState: guestFile } );

	test( 'Guest user can see shipping calculator on cart page', async ( {
		frontendUtils,
		page,
	} ) => {
		await frontendUtils.emptyCart();
		await frontendUtils.goToShop();
		await frontendUtils.addToCart( REGULAR_PRICED_PRODUCT_NAME );
		await frontendUtils.goToCart();

		await expect(
			page.getByLabel( 'Add an address for shipping options' )
		).toBeVisible();
	} );

	test( 'Guest user does not see shipping rates until full address is entered', async ( {
		checkoutPageObject,
		frontendUtils,
		page,
	} ) => {
		await frontendUtils.emptyCart();
		await frontendUtils.goToShop();
		await frontendUtils.addToCart( REGULAR_PRICED_PRODUCT_NAME );
		await frontendUtils.goToCheckout();

		await expect(
			page.getByText(
				'Shipping options will be displayed here after entering your full shipping addres'
			)
		).toBeVisible();

		await checkoutPageObject.fillInCheckoutWithTestData();

		await expect(
			page.getByText(
				'Shipping options will be displayed here after entering your full shipping addres'
			)
		).toBeHidden();
	} );
} );
