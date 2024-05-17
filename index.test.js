const {sequelize} = require('./db')
const {Restaurant, Menu, Item} = require('./models/index')
const {
    seedRestaurant,
    seedMenu,
    seedItem,
  } = require('./seedData');

describe('Restaurant and Menu Models', () => {
    /**
     * Runs the code prior to all tests
     */
    beforeAll(async () => {
        // the 'sync' method will create tables based on the model class
        // by setting 'force:true' the tables are recreated each time the 
        // test suite is run
        await sequelize.sync({ force: true });
    });

    test('can create a Restaurant', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
    
        expect(restaurant.cuisine).toBe("FastFood");
        expect(restaurant.location).toBe("Texas");
        expect(restaurant.name).toBe("AppleBees");
    });

    test('can create a Menu', async () => {
        const menu = await Menu.create(seedMenu[0]);

        expect(menu.title).toBe('Breakfast');
    });

    test("can create an Item", async () => {
        const item = await Item.create(seedItem[0]);

        expect(item.name).toBe('bhindi masala');
        expect(item.image).toBe('someimage.jpg');
        expect(item.price).toBe(9.50);
        expect(item.vegetarian).toBe(true);
    });

    test('can update a Restaurant instance', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[1]);
        const updatedRestaurant = await restaurant.update({ name: 'Updated Restaurant' });

        expect(updatedRestaurant.name).toEqual('Updated Restaurant');
    });
    
    test('can update a Menu instance', async () => {
        const menu = await Menu.create(seedMenu[0]);
        const updatedMenu = await menu.update({ title: 'Updated Menu' });

        expect(updatedMenu.title).toEqual('Updated Menu');
    });
    
    test('can update an Item instance', async () => {
        const item = await Item.create(seedItem[0]);
        const updatedItem = await item.update({ name: 'butter chicken' });

        expect(updatedItem.name).toEqual('butter chicken');
    });

    test('can delete a Restaurant instance', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
        await restaurant.destroy();
        const deletedRestaurant = await Restaurant.findByPk(restaurant.id);

        expect(deletedRestaurant).toBeNull();
    });

    test('can delete a Menu instance', async () => {
        const menu = await Menu.create(seedMenu[0]);
        await menu.destroy();
        const deletedMenu = await Menu.findByPk(menu.id);

        expect(deletedMenu).toBeNull();
    });

    test('can delete an Item instance', async () => {
        const item = await Item.create(seedItem[0]);
        await item.destroy();
        const deletedItem = await Item.findByPk(item.id);

        expect(deletedItem).toBeNull();
    });

    test('can create a Restaurant and Menu association', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
        const menu = await Menu.create(seedMenu[0]);
        await restaurant.addMenu(menu);
        const menus = await restaurant.getMenus();
        expect(menus.length).toEqual(1);
    });

    test('can create a Menu from an association with a Restaurant', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
        const menu = await restaurant.createMenu({
            title: 'Dinner',
        });
        await restaurant.getMenus();
        expect(menu.title).toBe('Dinner');
    });

    test('can create a Menu and Item association', async () => {
        const menu = await Menu.create(seedMenu[0]);
        const item = await Item.create(seedItem[0]);
        await menu.addItem(item);
        const items = await menu.getItems();
        expect(items.length).toEqual(1);
    });

    test('can associate many Items with a Menu', async () => {
        const menu = await Menu.create(seedMenu[0]);
        await menu.createItem({
            name: 'butter chicken',
            image: 'someimage.jpg',
            price: 9.50,
            vegetarian: false
        });
        await menu.createItem({
            name: 'paneer tikka',
            image: 'someimage.jpg',
            price: 11.50,
            vegetarian: true
        });
        const items = await menu.getItems();

        expect(items[0].name).toBe('butter chicken');
        expect(items[1].name).toBe('paneer tikka');
    });

    test('can associate many Menus with an Item', async () => {
        const item = await Item.create(seedItem[0]);
        await item.createMenu({
            title: 'Tasting menu',
        });
        await item.createMenu({
            title: 'Set menu',
        });
        const menus = await item.getMenus();

        expect(menus[0].title).toBe('Tasting menu');
        expect(menus[1].title).toBe('Set menu');
    });
});
