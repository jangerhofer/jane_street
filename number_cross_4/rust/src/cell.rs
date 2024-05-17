#[derive(Debug, Clone)]
pub enum Cell {
    Vacant,
    Number(u8),
    Shaded,
}

impl Cell {
    // This function constrains the `Number` variant to be between 0 and 9 inclusive
    pub fn new_number(n: u8) -> Option<Self> {
        if n <= 9 {
            Some(Cell::Number(n))
        } else {
            None
        }
    }
}
