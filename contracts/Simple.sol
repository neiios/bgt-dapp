// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity >=0.8.0;

contract Simple {
  uint storedNumber;

  function set(uint x) public {
    storedNumber = x;
  }

  function get() public view returns (uint) {
    return storedNumber;
  }
}
