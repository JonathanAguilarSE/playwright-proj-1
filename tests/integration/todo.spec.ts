import { test, expect } from "@playwright/test";
import { clickLink } from "../../helpers/clickHelpers";

test.describe("To-Do List", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://www.techglobal-training.com/frontend")
        await clickLink(page, "Todo List")
    })

    test("Todo App Modal Verification", async ({ page }) => {
        const modal = page.locator(".panel")
        const modalTitle = page.locator(".panel-heading")
        const newTodoInput = page.locator("#input-add")
        const addBtn = page.locator("#add-btn")
        const searchInput = page.locator("#search")
        const emptyTaskList = page.locator(".todo-item")

        await test.step("Confirm that the todo-app modal is visible with the title \“My Tasks.\"", async () => {
            await expect(modal).toBeVisible()
            await expect(modalTitle).toHaveText("My Tasks")
        })

        await test.step("Validate that the New todo input field is enabled for text entry.", async () => {
            await expect(newTodoInput).toBeEnabled()
        })

        await test.step("Validate ADD button is enabled.", async () => {
            await expect(addBtn).toBeEnabled()
        })

        await test.step("Validate Search field is enabled.", async () => {
            await expect(searchInput).toBeEnabled()
        })

        await test.step("Validate that the task list is empty, displaying the message \“No tasks found!\”", async () => {
            await expect(emptyTaskList).toHaveText("No tasks found!")
        })
    })

    test("Single Task Addition and Removal", async ({ page }) => {
        const newTodoInput = page.locator("#input-add")
        const addBtn = page.locator("#add-btn")
        const taskList = page.locator("#panel .todo-item")
        const strikeTask = page.locator(".mr-auto span").last()
        const visibleTask = page.locator(".mr-auto span").first()
        const rmvBtn = page.locator("#clear")
        const emptyTaskList = page.locator(".todo-item")

        await test.step("Enter a new task in the todo input field and add it to the list.", async () => {
            await newTodoInput.fill("Complete playwright project.")
            await addBtn.click()
        })

        await test.step("Validate that the new task appears in the task list.", async () => {
            await taskList.isVisible()
        })

        await test.step("Validate that the number of tasks in the list is exactly one.", async () => {
            expect(taskList).toHaveCount(1)
        })

        await test.step("Mark the task as completed by clicking on it.", async () => {
            await strikeTask.click()
        })

        await test.step("Validate item is marked as completed.", async () => {
            await expect(visibleTask).toHaveClass("panel-icon has-text-success")
        })

        await test.step("Click on the button to remove the item you have added.", async () => {
            await rmvBtn.click()
        })
        
        await test.step("Validate that the task list is empty, displaying the message \“No tasks found!\”", async () => {
            await expect(emptyTaskList).toHaveText("No tasks found!")
        })
    })

    test("Multiple Task Operations", async ({ page }) => {
        const newTodoInput = page.locator("#input-add")
        const addBtn = page.locator("#add-btn")
        const taskList = page.locator("#panel .todo-item")
        const strikeTask = page.locator("svg.svg-inline--fa.fa-circle-check ")
        const strikeTaskArr = await strikeTask.all()
        const visibleTask = page.locator(".mr-auto span").first()
        const strikeTaskCount = await strikeTask.count()
        const taskCount = await taskList.count()
        const rmvBtn = page.locator("#clear")
        const emptyTaskList = page.locator(".todo-item")
        const tasks = [ 'walk', 'run', 'jump', 'skip', 'hop']

        await test.step("Enter and add 5 to-do items individually.", async () => {
            for (const task of tasks) {
                await newTodoInput.fill(task)
                await addBtn.click()
                await newTodoInput.clear()
            }
        })

        await test.step("Validate that all added items match the items displayed on the list.", async () => {
            await expect(taskList).toContainText(tasks)
        })

        await test.step("Mark all the tasks as completed by clicking on them.", async () => {
            // for (let i = 0; i <= strikeTaskCount; i++){
            //     await strikeTask.nth(i).click()
            // }
            // for (const task of strikeTaskArr){
            //     await task.click()
            // }
            await strikeTask.nth(0).click()
            await strikeTask.nth(1).click()
            await strikeTask.nth(2).click()
            await strikeTask.nth(3).click()
            await strikeTask.nth(4).click()
        })

        await test.step("Click on the “Remove completed tasks!” button to clear them.", async () => {
            await rmvBtn.click()
        })

        await test.step("Validate that the task list is empty, displaying the message “No tasks found!”.", async () => {
            await expect(emptyTaskList).toHaveText("No tasks found!")
        })
    })

    test("Search and Filter Functionality in todo App", async ({ page }) => {
        const newTodoInput = page.locator("#input-add")
        const addBtn = page.locator("#add-btn")
        const taskList = page.locator("#panel .todo-item")
        const tasks = [ 'walk', 'run', 'jump', 'skip', 'hop']
        const searchInput = page.locator("#search")

        await test.step("Enter and add 5 to-do items individually.", async () => {
            for (const task of tasks) {
                await newTodoInput.fill(task)
                await addBtn.click()
                await newTodoInput.clear()
            }
        })

        await test.step("Validate that all added items match the items displayed on the list.", async () => {
            await expect(taskList).toContainText(tasks)
        })

        await test.step("Enter the complete name of the previously added to-do item into the search bar.", async () => {
            await searchInput.fill(tasks[4])
        })

        await test.step("Validate that the list is now filtered to show only the item you searched for.", async () => {
            await expect(taskList).toHaveText(tasks[4])
        })

        await test.step("Validate that the number of tasks visible in the list is exactly one.", async () => {
            await expect(taskList).toHaveCount(1)
        })
    })

    test("Task Validation and Error Handling", async ({ page }) => {
        const newTodoInput = page.locator("#input-add")
        const addBtn = page.locator("#add-btn")
        const taskList = page.locator("#panel .todo-item")
        const emptyTaskList = page.locator(".todo-item")
        const errorMsg = page.locator(".notification")
        const item = "Playwright"

        await test.step("Attempt to add an empty task to the to-do list.", async () => {
            await newTodoInput.clear()
            await addBtn.click()
        })

        await test.step("Validate that the task list is empty, displaying the message “No task found!”.", async () => {
            await expect(emptyTaskList).toHaveText("No tasks found!")
        })

        await test.step("Enter an item name exceeding 30 characters into the list.", async () => {
            await newTodoInput.fill("qwertyuioplkjhgfdsazxcvbnjm1234567890")
            await addBtn.click()
        })

        await test.step("Enter an item name exceeding 30 characters into the list.", async () => {
            expect(errorMsg).toHaveText("Error: Todo cannot be more than 30 characters!")
        })

        await test.step("Add a valid item name to the list.", async () => {
            await newTodoInput.fill(item)
            await addBtn.click()
        })

        await test.step("Validate that the active task count is exactly one.", async () => {
            expect(taskList).toHaveCount(1)
        })

        await test.step("Try to enter an item with the same name already present on the list.", async () => {
            await newTodoInput.fill(item)
            await addBtn.click()
        })
        
        await test.step("Validate that an error message is displayed, indicating “Error: You already have {ITEM} in your todo list.”.", async () => {
            await expect(errorMsg).toHaveText(`Error: You already have ${item} in your todo list.`)
        })
    })
})