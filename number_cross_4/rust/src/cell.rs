#[derive(Debug, Clone)]
pub enum Cell {
    Vacant(usize),     // Now includes a region identifier
    Number(u8, usize), // Number with a region identifier
    Shaded(usize),     // Shaded with a region identifier
}

impl Cell {
    // This function constrains the `Number` variant to be between 0 and 9 inclusive
    pub fn new_number(n: u8, region: usize) -> Option<Self> {
        if n <= 9 {
            Some(Cell::Number(n, region))
        } else {
            None
        }
    }
}
