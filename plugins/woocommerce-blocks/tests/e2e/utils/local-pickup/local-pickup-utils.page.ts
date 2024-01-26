/**
 * External dependencies
 */
import { expect } from '@woocommerce/e2e-playwright-utils';
import { Page } from '@playwright/test';
import { Admin } from '@wordpress/e2e-test-utils-playwright';

type Location = {
	name: string;
	address: string;
	city: string;
	postcode: string;
	state: string;
	details: string;
};

export class LocalPickupUtils {
	private page: Page;

	constructor( page: Page ) {
		this.page = page;
	}

	async openLocalPickupSettings( { admin }: { admin: Admin } ) {
		await admin.visitAdminPage(
			'admin.php',
			'page=wc-settings&tab=shipping&section=pickup_location'
		);
	}

	async saveLocalPickupSettings( { page }: { page: Page } ) {
		await page.getByRole( 'button', { name: 'Save changes' } ).click();
	}

	async enableLocalPickup( { page }: { page: Page } ) {
		await page.getByLabel( 'Enable local pickup' ).check();

		await this.saveLocalPickupSettings( { page } );
	}

	async disableLocalPickup( { page }: { page: Page } ) {
		await page.getByLabel( 'Enable local pickup' ).uncheck();

		await this.saveLocalPickupSettings( { page } );
	}

	async enableLocalPickupCosts( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Add a price for customers who choose local pickup' )
			.check();

		await this.saveLocalPickupSettings( { page } );
	}

	async disableLocalPickupCosts( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Add a price for customers who choose local pickup' )
			.uncheck();

		await this.saveLocalPickupSettings( { page } );
	}

	async clearLocations( admin: Admin, page: Page ) {
		await admin.visitAdminPage(
			'admin.php',
			'page=wc-settings&tab=shipping&section=pickup_location'
		);

		const editButtons = page.locator(
			'.pickup-locations tbody tr .button-link-edit'
		);
		const buttonsCount = await editButtons.count();

		for ( let i = 0; i < buttonsCount; i++ ) {
			const button = editButtons.nth( i );
			await button.click();

			const deleteButton = page.locator(
				'.components-modal__content button:text("Delete location")'
			);
			await deleteButton.click();

			await expect(
				page.locator( '.components-modal__content' )
			).toHaveCount( 0 );
		}

		await page.waitForSelector(
			'.pickup-locations tbody tr td:has-text("When you add a pickup location, it will appear here.")'
		);
		await this.saveLocalPickupSettings( { page } );
	}

	async removeCostForLocalPickup( { page }: { page: Page } ) {
		await page
			.getByLabel( 'Add a price for customers who choose local pickup' )
			.uncheck();

		await this.saveLocalPickupSettings( { page } );
	}

	async addPickupLocation( {
		page,
		location,
	}: {
		page: Page;
		location: Location;
	} ) {
		await page.getByText( 'Add pickup location' ).click();
		await page.getByLabel( 'Location name' ).fill( location.name );
		await page.getByPlaceholder( 'Address' ).fill( location.address );
		await page.getByPlaceholder( 'City' ).fill( location.city );
		await page
			.getByPlaceholder( 'Postcode / ZIP' )
			.fill( location.postcode );
		await page
			.getByLabel( 'Country / State' )
			.selectOption( location.state );
		await page.getByLabel( 'Pickup details' ).fill( location.details );
		await page.getByRole( 'button', { name: 'Done' } ).click();

		await this.saveLocalPickupSettings( { page } );
	}

	async editPickupLocation( {
		page,
		location,
	}: {
		page: Page;
		location: Location;
	} ) {
		await page.getByRole( 'button', { name: 'Edit' } ).click();
		await page.getByLabel( 'Location name' ).fill( location.name );
		await page.getByPlaceholder( 'Address' ).fill( location.address );
		await page.getByPlaceholder( 'City' ).fill( location.city );
		await page
			.getByPlaceholder( 'Postcode / ZIP' )
			.fill( location.postcode );
		await page
			.getByLabel( 'Country / State' )
			.selectOption( location.state );
		await page.getByLabel( 'Pickup details' ).fill( location.details );
		await page.getByRole( 'button', { name: 'Done' } ).click();

		await this.saveLocalPickupSettings( { page } );
	}

	async deletePickupLocation( { page }: { page: Page } ) {
		await page.getByRole( 'button', { name: 'Edit' } ).click();
		await page.getByRole( 'button', { name: 'Delete location' } ).click();

		await this.saveLocalPickupSettings( { page } );
	}
}
