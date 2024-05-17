use crate::cell::Cell;
use crate::region::Region;

use std::collections::HashSet;

pub struct Grid {
    dimension: usize,
    cells: Vec<Vec<Cell>>,
    regions: Vec<Region>, // List of regions
}

impl Grid {
    // Check if the same cell is in multiple regions
    fn check_duplicate_cells_in_regions(&self) -> bool {
        let mut cell_set = HashSet::new();
        for region in &self.regions {
            for &cell in &region.cells {
                if !cell_set.insert(cell) {
                    println!("Duplicate cell found in multiple regions: {:?}", cell);
                    return true;
                }
            }
        }
        false
    }

    // Create a new grid with the given dimension and initial regions
    pub fn new(
        dimension: usize,
        initial_regions: Vec<(usize, Vec<(usize, usize)>)>,
    ) -> Result<Self, String> {
        let mut cells = vec![vec![Cell::Vacant(0); dimension]; dimension];
        let mut regions = Vec::new();
        let mut cell_set = HashSet::new();

        // Initialize regions based on the provided configuration
        for (region_id, coordinates) in initial_regions {
            if region_id >= regions.len() {
                regions.resize_with(region_id + 1, || Region::new(region_id));
            }
            let region = &mut regions[region_id];
            for &(row, col) in &coordinates {
                if row < dimension && col < dimension {
                    if !cell_set.insert((row, col)) {
                        return Err(format!(
                            "Duplicate cell found in multiple regions: ({}, {})",
                            row, col
                        ));
                    }
                    cells[row][col] = Cell::Vacant(region_id); // Initially mark as Vacant
                    region.add_cell(row, col);
                }
            }
        }

        Ok(Grid {
            dimension,
            cells,
            regions,
        })
    }

    // Set a cell to a new value and assign it to a region
    fn set_cell(&mut self, row: usize, col: usize, cell: Cell) {
        if row < self.dimension && col < self.dimension {
            match &cell {
                Cell::Vacant(region) | Cell::Number(_, region) | Cell::Shaded(region) => {
                    // Ensure the region exists
                    if *region >= self.regions.len() {
                        for i in self.regions.len()..=*region {
                            self.regions.push(Region::new(i));
                        }
                    }
                    self.cells[row][col] = cell.clone();
                    self.regions[*region].add_cell(row, col);
                }
            }
        } else {
            println!("Index out of bounds");
        }
    }

    // Get a cell value
    fn get_cell(&self, row: usize, col: usize) -> Option<&Cell> {
        if row < self.dimension && col < self.dimension {
            Some(&self.cells[row][col])
        } else {
            None
        }
    }

    // Output the grid contents in a text grid
    pub fn display(&self) {
        for row in &self.cells {
            for cell in row {
                match cell {
                    Cell::Vacant(_) => print!(" . "),
                    Cell::Number(n, _) => print!(" {} ", n),
                    Cell::Shaded(_) => print!(" # "),
                }
            }
            println!();
        }
    }

    // Output the region information
    pub fn display_regions(&self) {
        for region in &self.regions {
            println!("Region {}: {:?}", region.id, region.cells);
        }
    }
}
