const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
describe('Bloglist app', () => {
    beforeEach(async ({ page, request }) => {
        await page.pause()
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Testing Personel',
                username: 'tester404',
                password: '404test'
            }
        })
        await request.post('/api/users', {
            data: {
                name: 'Other Testing Personel',
                username: 'tester403',
                password: '403test'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })
    describe('login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'tester404', '404test')
            await expect(page.getByText('Testing Personel logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'WrongUsername', 'WrongPassword')
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'tester404', '404test')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(
                page,
                'How to do End to End testing with Playwright',
                'Matti Luukkainen',
                'https://fullstackopen.com/en/part5/'
            )
            await expect(page.getByTestId('blogTitle')).toContainText('How to do End to End testing with Playwright')
        })
        describe('When there is as current blog', () => {
            beforeEach(async ({ page }) => {
                await createBlog(
                    page,
                    'How to do End to End testing with Playwright',
                    'Matti Luukkainen',
                    'https://fullstackopen.com/en/part5/'
                )
            })

            test('can like a blog', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                const expectedLikes = Number(await page.getByTestId('likes').innerText()) + 1
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByTestId('likes')).toContainText(`${expectedLikes}`)
            })

            test('can delete blog', async ({ page }) => {
                page.on('dialog', dialog => dialog.accept());
                await page.getByRole('button', { name: 'remove' }).click()
                await expect(page.getByTestId('blogTitle')).toHaveCount(0)
            })

            test('only owner of blog sees remove button', async ({ page }) => {
                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
                await page.getByRole('button', { name: 'logout' }).click()
                await loginWith(page, 'tester403', '403test')
                await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
            })

            test('sorted blogs by likes', async ({ page }) => {
                await page.getByRole('button', { name: 'View' }).click();
                await page.getByRole('button', { name: 'like' }).click();
                await page.getByRole('button', { name: 'New Blog' }).click();
                await page.getByTestId('title').fill('Blog2');
                await page.getByTestId('author').fill('Matti Luukkainen');
                await page.getByTestId('url').fill('https://test.com');
                await page.getByRole('button', { name: 'create' }).click();
                await page.getByRole('button', { name: 'View' }).click();
                await expect(page.getByTestId('blogTitle').nth(0)).toContainText('How to do End to End testing with Playwright')
                await page.getByRole('button', { name: 'like' }).nth(1).click();
                await expect(page.getByTestId('blogTitle').nth(1)).toContainText('Blog2')
                await page.getByRole('button', { name: 'like' }).nth(1).click();
                await expect(page.getByTestId('blogTitle').nth(0)).toContainText('Blog2')
                await expect(page.getByTestId('blogTitle').nth(1)).toContainText('How to do End to End testing with Playwright')
            })

        })
    })
})