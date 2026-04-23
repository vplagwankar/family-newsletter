using FamilyNewsletter.Api.Data;
using FamilyNewsletter.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace FamilyNewsletter.Api.Controllers;

[ApiController]
[Route("api/family-tree")]
public class FamilyTreeController(DataStore store) : ControllerBase
{
    /// <summary>
    /// Builds and returns the family tree.
    /// Logic mirrors getFamilyTree() in the JavaScript api.js:
    ///   - Spouse links are bidirectional.
    ///   - Children attach to the male parentId (father-first rule).
    ///   - Roots = gen-1 males with no parentIds.
    ///   - Orphans = non-root members with no parentIds who are not spouses.
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        var members = store.Members.Where(m => !m.Deleted).ToList();

        // Build a node map: id → node (with spouse + children populated below)
        var nodes = members.ToDictionary(
            m => m.Id,
            m => new TreeNode(m)
        );

        // ── Spouse links ──────────────────────────────────────────────────────
        var spouseLinked = new HashSet<string>();
        foreach (var m in members)
        {
            if (m.SpouseId is null || spouseLinked.Contains(m.Id)) continue;
            if (!nodes.TryGetValue(m.SpouseId, out var spouseNode)) continue;

            nodes[m.Id].Spouse   = spouseNode;
            spouseNode.Spouse    = nodes[m.Id];
            spouseLinked.Add(m.Id);
            spouseLinked.Add(m.SpouseId);
        }

        // ── Child attachments ─────────────────────────────────────────────────
        foreach (var m in members)
        {
            if (m.ParentIds is null || m.ParentIds.Count == 0) continue;

            // Prefer attaching to the male parent (father); fall back to first parentId.
            var fatherId = m.ParentIds.FirstOrDefault(pid =>
                nodes.TryGetValue(pid, out var n) && n.Member.Gender == "male");
            var attachTo = fatherId ?? m.ParentIds[0];

            if (nodes.TryGetValue(attachTo, out var parentNode))
                parentNode.Children.Add(nodes[m.Id]);
        }

        // ── Roots & orphans ───────────────────────────────────────────────────
        var rootIds = members
            .Where(m => (m.ParentIds == null || m.ParentIds.Count == 0)
                        && m.Generation == 1
                        && m.Gender == "male")
            .Select(m => m.Id)
            .ToHashSet();

        var allSpouseIds = members
            .Where(m => m.SpouseId is not null)
            .Select(m => m.SpouseId!)
            .ToHashSet();

        var orphans = members
            .Where(m => (m.ParentIds == null || m.ParentIds.Count == 0)
                        && !rootIds.Contains(m.Id)
                        && !allSpouseIds.Contains(m.Id))
            .Select(m => nodes[m.Id])
            .ToList();

        return Ok(new
        {
            Roots   = rootIds.Select(id => nodes[id]).ToList(),
            Orphans = orphans,
        });
    }
}

/// <summary>
/// A node in the family tree — wraps a FamilyMember and adds Spouse + Children.
/// </summary>
public class TreeNode(FamilyMember member)
{
    public FamilyMember  Member   { get; } = member;
    public TreeNode?     Spouse   { get; set; }
    public List<TreeNode> Children { get; } = [];
}