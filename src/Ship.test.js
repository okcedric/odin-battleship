import { expect } from 'vitest'
import Ship from './Ship'

test('returns an object', () => {
    expect(typeof Ship(1)).toBe('object');
})

test('throws an error if argument is not an integer', () => {
    expect(()=>{
        Ship('carrier')
    }).toThrow()
}) 

test("throws an error if argument is not between 1 and 5", () => {
  expect(() => {
    Ship(25);
  }).toThrow();

   expect(() => {
     Ship(0);
   }).toThrow();
}); 

test('returns name correctly', () => {
    expect(Ship(4).getName()).toBe('Submarine')
})

test('get sunk after too much hit',()=> {
    let ship = Ship(2);
    ship.hit();
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
})
test ("doesn't get sunk before too much hit", ()=>{
    let ship = Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
})