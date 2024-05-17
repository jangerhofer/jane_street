use std::collections::HashSet;

#[derive(Debug, Clone)]
pub struct Region {
    pub id: usize,
    pub cells: HashSet<(usize, usize)>, // A set of (row, col) coordinates
}

impl Region {
    pub fn new(id: usize) -> Self {
        Region {
            id,
            cells: HashSet::new(),
        }
    }

    pub fn add_cell(&mut self, row: usize, col: usize) {
        self.cells.insert((row, col));
    }
}
