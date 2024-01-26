/**
 * External dependencies
 */
import { test, expect } from '@woocommerce/e2e-playwright-utils';

const permalink = '/checkout';
const templatePath = 'woocommerce/woocommerce//page-checkout';
const templateType = 'wp_template';
const userText = 'Hello World in the template';

test.describe( 'Test the checkout template', async () => {
	test( 'Template can be opened in the site editor', async ( {
		admin,
		page,
		editorUtils,
	} ) => {
		await admin.visitSiteEditor( {
			postId: templatePath,
			postType: templateType,
		} );
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await expect(
			page
				.frameLocator( 'iframe[title="Editor canvas"i]' )
				.locator( 'h1:has-text("Checkout")' )
				.first()
		).toBeVisible();
	} );

	test( 'Template can be accessed from the page editor', async ( {
		admin,
		editor,
		page,
		editorUtils,
	} ) => {
		await admin.visitSiteEditor( {
			postId: templatePath,
			postType: templateType,
		} );
		await admin.visitAdminPage( 'site-editor.php', 'path=%2Fpage' );
		await editor.page
			.getByRole( 'button', { name: 'Checkout', exact: true } )
			.click();
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();

		await expect(
			editor.canvas.locator( 'h1:has-text("Checkout")' ).first()
		).toBeVisible();

		await editor.openDocumentSettingsSidebar();
		await page.getByLabel( 'Template options' ).click();
		await page.getByRole( 'menuitem', { name: 'Edit template' } ).click();

		await expect(
			editor.canvas.locator( 'h1:has-text("Checkout")' ).first()
		).toBeVisible();
	} );

	test( 'Admin bar edit site link opens site editor', async ( { admin } ) => {
		await admin.page.goto( permalink, { waitUntil: 'load' } );
		await admin.page.locator( '#wp-admin-bar-site-editor a' ).click();
		await expect(
			admin.page
				.frameLocator( 'iframe[title="Editor canvas"i]' )
				.locator( 'h1:has-text("Checkout")' )
				.first()
		).toBeVisible();
	} );
} );

test.describe( 'Test editing the checkout template', async () => {
	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deleteAllTemplates( 'wp_template' );
		await requestUtils.deleteAllTemplates( 'wp_template_part' );
	} );

	test( 'Merchant can transform shortcode block into blocks', async ( {
		admin,
		editorUtils,
		editor,
	} ) => {
		await admin.visitSiteEditor( {
			postId: templatePath,
			postType: templateType,
		} );
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await editor.setContent(
			'<!-- wp:woocommerce/classic-shortcode {"shortcode":"checkout"} /-->'
		);
		await editor.canvas.waitForSelector(
			'.wp-block-woocommerce-classic-shortcode'
		);
		await editor.canvas
			.getByRole( 'button', { name: 'Transform into blocks' } )
			.click();
		await expect(
			editor.canvas.locator( 'button:has-text("Place order")' ).first()
		).toBeVisible();
	} );

	test( 'Template can be modified', async ( {
		admin,
		editorUtils,
		frontendUtils,
	} ) => {
		await admin.visitSiteEditor( {
			postId: templatePath,
			postType: templateType,
		} );
		await editorUtils.enterEditMode();
		await editorUtils.closeWelcomeGuideModal();
		await editorUtils.editor.insertBlock( {
			name: 'core/paragraph',
			attributes: { content: userText },
		} );
		await editorUtils.saveTemplate();
		await frontendUtils.goToShop();
		await frontendUtils.emptyCart();
		await frontendUtils.addToCart();
		await frontendUtils.goToCheckout();
		await expect(
			frontendUtils.page.getByText( userText ).first()
		).toBeVisible();
	} );
} );
