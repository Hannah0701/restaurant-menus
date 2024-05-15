const {sequelize} = require('./db')
const {Restaurant, Menu} = require('./models/index')
const {
    seedRestaurant,
    seedMenu,
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
        const restaurant = await seedRestaurant[0];
        expect(restaurant).toEqual({"cuisine": "FastFood", "location": "Texas", "name": "AppleBees"})
    });

    test('can create a Menu', async () => {
        const menu = await seedMenu[1];
        expect(menu).toEqual({title: 'Lunch'})
    });

    test('can update a Restaurant instance', async () => {
        const restaurant = await Restaurant.create(seedRestaurant[0]);
        const updatedRestaurant = await restaurant.update({ name: 'Updated Restaurant' });
        expect(updatedRestaurant.name).toEqual('Updated Restaurant');
    });
    
    test('can update a Menu instance', async () => {
        const menu = await Menu.create(seedMenu[0]);
        const updatedMenu = await menu.update({ title: 'Updated Menu' });
        expect(updatedMenu.title).toEqual('Updated Menu');
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
})