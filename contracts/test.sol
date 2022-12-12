// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;

contract test {
  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
