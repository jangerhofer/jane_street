mod cell;
mod grid;
mod region;

use crate::grid::Grid;

fn main() {
    let dimension = 7;

    // Initial regions configuration
    let initial_regions = vec![
        (1, vec![(0, 0), (0, 1), (1, 0), (1, 1)]),
        (2, vec![(2, 2), (2, 3), (3, 2), (3, 3)]),
        (3, vec![(0, 2), (0, 3), (1, 2), (1, 3)]),
        (4, vec![(2, 0), (2, 1), (3, 0), (3, 1)]),
    ];

    let mut grid = match Grid::new(dimension, initial_regions) {
        Ok(grid) => grid,
        Err(e) => {
            println!("Error initializing grid: {}", e);
            return;
        }
    };

    // Perform operations on the grid
    // Example: set some cells
    if let Some(number_cell) = cell::Cell::new_number(5, 1) {
        grid.set_cell(1, 1, number_cell);
    }
    grid.set_cell(2, 2, cell::Cell::Shaded(2));

    // Display the grid
    println!("Grid:");
    grid.display();

    // Display the regions
    println!("\nRegions:");
    grid.display_regions();
}
