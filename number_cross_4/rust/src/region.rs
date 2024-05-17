use std::collections::HashSet;

#[derive(Debug, Clone)]
pub struct Region {
    pub cells: HashSet<(usize, usize)>, // A set of (row, col) coordinates
}

impl Region {
    pub fn new() -> Self {
        Region {
            cells: HashSet::new(),
        }
    }

    pub fn add_cell(&mut self, row: usize, col: usize) {
        self.cells.insert((row, col));
    }
}
