mod cell;
mod grid;
mod region;

use crate::grid::Grid;

fn main() {
    let dimension = 4;

    // Initial regions configuration
    let initial_regions = vec![
        (1, vec![(0, 0), (0, 1), (1, 0), (1, 1)]),
        (2, vec![(2, 2), (2, 3), (3, 2), (3, 3)]),
        (3, vec![(0, 2), (0, 3), (1, 2), (1, 3)]),
        (4, vec![(2, 0), (2, 1), (3, 0), (3, 1)]),
    ];

    let mut grid = Grid::new(dimension, initial_regions).unwrap();

    // Display the grid
    println!("Grid:");
    grid.display();

    // Display the regions
    println!("\nRegions:");
    grid.display_regions();
}
